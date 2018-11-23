const MetaTxProxy = artifacts.require("MetaTxProxy")
const EcTools = artifacts.require("EcTools")
const ExternalContract = artifacts.require("ExternalContract")

const BN = require("bn.js")
const shouldFail = require("openzeppelin-solidity/test/helpers/shouldFail")

contract("MetaTxProxy", accounts => {

    let metaTxProxy, ecTools, externalContract
    const relayAccount = accounts[0]
    const signingAccount = accounts[1]
    const receiverAccount = accounts[2]

    const oneEthWeiValue = web3.utils.toWei('1', 'ether')
    const emptyTransactionData = "0x00"
    const zeroRelayerReward = 0

    beforeEach(async () => {
        ecTools = await EcTools.new()
        MetaTxProxy.link("EcTools", ecTools.address)
        metaTxProxy = await MetaTxProxy.new({from: signingAccount})
        await metaTxProxy.send(web3.utils.toWei('5', 'ether'))

        externalContract = await ExternalContract.new()
    })

    describe("getSigner(address signature)", () => {

        it("returns expected address as the signer", async () => {
            const hashToSign = await metaTxProxy.getTransactionHash(receiverAccount, 0, emptyTransactionData, 0)
            const signatureOfHash = await web3.eth.sign(hashToSign, signingAccount)

            const signer = await metaTxProxy.getSigner(hashToSign, signatureOfHash)

            assert.equal(signer, signingAccount)
        })
    })

    describe("executeTransaction(address receiver, uint256 value, bytes data, bytes signature)", () => {

        it("succeeds from an account other than the proxy owner and sends value", async () => {
            const receiverCurrentBalance = await web3.eth.getBalance(receiverAccount)
            const expectedBalance = (new BN(oneEthWeiValue)).add(new BN(receiverCurrentBalance))
            const messageHashToSign = await metaTxProxy.getTransactionHash(receiverAccount, oneEthWeiValue, emptyTransactionData, zeroRelayerReward)
            const signatureOfMessageHash = await web3.eth.sign(messageHashToSign, signingAccount)

            await metaTxProxy.executeTransaction(receiverAccount, oneEthWeiValue, emptyTransactionData,
                zeroRelayerReward, signatureOfMessageHash, {from: relayAccount})

            const actualBalance = await web3.eth.getBalance(receiverAccount)
            assert.equal(actualBalance.toString(), expectedBalance.toString())
        })

        it("reverts when submitting the same transaction twice", async () => {
            const messageHashToSign = await metaTxProxy.getTransactionHash(receiverAccount, oneEthWeiValue, emptyTransactionData, zeroRelayerReward)
            const signatureOfMessageHash = await web3.eth.sign(messageHashToSign, signingAccount)

            await metaTxProxy.executeTransaction(receiverAccount, oneEthWeiValue, emptyTransactionData,
                zeroRelayerReward, signatureOfMessageHash, {from: relayAccount})
            await shouldFail.reverting(metaTxProxy.executeTransaction(
                receiverAccount, oneEthWeiValue, emptyTransactionData, zeroRelayerReward, signatureOfMessageHash, {from: relayAccount}))
        })

        it("executes transaction on external contract", async () => {
            const expectedValue = 2
            const transactionData = externalContract.contract.methods.updateValue(expectedValue).encodeABI()
            const transactionHashToSign = await metaTxProxy.getTransactionHash(externalContract.address, 0, transactionData, zeroRelayerReward)
            const signatureOfTransactionHash = await web3.eth.sign(transactionHashToSign, signingAccount)

            await metaTxProxy.executeTransaction(externalContract.address, 0, transactionData,
                zeroRelayerReward, signatureOfTransactionHash, {from: relayAccount})

            const actualValue = await externalContract._value()
            assert.equal(actualValue, expectedValue)
        })

        it("rewards relayer the specified reward amount", async () => {
            const reward = web3.utils.toWei("2", "finney")
            const currentBalance = await web3.eth.getBalance(relayAccount)
            const gasCost = web3.utils.toWei("10", "gwei")
            let expectedBalance = (new BN(reward)).add(new BN(currentBalance))
            const transactionHashToSign = await metaTxProxy.getTransactionHash(receiverAccount, oneEthWeiValue, emptyTransactionData, reward)
            const signatureOfTransactionHash = await web3.eth.sign(transactionHashToSign, signingAccount)

            const transaction = await metaTxProxy.executeTransaction(receiverAccount, oneEthWeiValue,
                emptyTransactionData, reward, signatureOfTransactionHash, {from: relayAccount, gasPrice: gasCost})

            const transactionCost = transaction.receipt.gasUsed * gasCost
            expectedBalance = expectedBalance.sub(new BN(transactionCost))
            const actualBalance = await web3.eth.getBalance(relayAccount)
            assert.equal(actualBalance.toString(), expectedBalance.toString())
        })
    })
})