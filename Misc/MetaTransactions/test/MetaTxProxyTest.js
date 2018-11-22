const MetaTxProxy = artifacts.require("MetaTxProxy")
const ECTools = artifacts.require("ECTools")
const BN = require("bn.js")
const testUtils = require("../../../Utils/TestUtils")

contract("MetaTxProxy", accounts => {

    let metaTxProxy, ecTools
    const relayAccount = accounts[0]
    const signingAccount = accounts[1]
    const receiverAccount = accounts[2]

    beforeEach(async () => {
        ecTools = await ECTools.new()
        MetaTxProxy.link("ECTools", ecTools.address)
        metaTxProxy = await MetaTxProxy.new({from: signingAccount})
        await metaTxProxy.send(web3.utils.toWei('1', 'ether'))
    })

    describe("getSigner(address signature)", () => {

        it("returns expected address as the signer", async () => {
            const hashToSign = await metaTxProxy.getHashOf(receiverAccount, 0)
            const signatureOfHash = await web3.eth.sign(hashToSign, signingAccount)

            const signer = await metaTxProxy.getSigner(hashToSign, signatureOfHash)

            assert.equal(signer, signingAccount)
        })
    })

    describe("basicSend(address receiver, uint256 value, bytes signature)", () => {

        it("an account other than the proxy creator sends value", async () => {
            const weiValue = web3.utils.toWei('1', 'ether')
            const receiverCurrentBalance = await web3.eth.getBalance(receiverAccount)
            const expectedBalance = (new BN(weiValue)).add(new BN(receiverCurrentBalance))

            const messageHashToSign = await metaTxProxy.getHashOf(receiverAccount, weiValue)
            const signatureOfMessageHash = await web3.eth.sign(messageHashToSign, signingAccount)

            await metaTxProxy.basicSend(receiverAccount, weiValue, signatureOfMessageHash, {from: relayAccount})

            const actualBalance = await web3.eth.getBalance(receiverAccount)
            assert.equal(actualBalance.toString(), expectedBalance.toString())
        })
    })
})