const ERC223Token = artifacts.require("./StandardERC223Token.sol")
const TokenReceiver = artifacts.require("./ExampleERC223Receiver.sol");
const TestUtils = require("../../TestUtils.js")

contract("ERC223Token", accounts => {

    let erc223Token, tokenReceiver

    beforeEach(async () => {
        erc223Token = await ERC223Token.new(1000, {from: accounts[0]})
        tokenReceiver = await TokenReceiver.new()
    })

    describe("transfer(address to, uint value)", () => {

        it("transfers to a normal account", async () => {
            await erc223Token.transfer(accounts[1], 100)
            const acc0Balance = await erc223Token.balanceOf(accounts[0])
            const acc1Balance = await erc223Token.balanceOf(accounts[1])

            assert.equal(acc0Balance.toNumber(), 900, "Senders balance is incorrect")
            assert.equal(acc1Balance.toNumber(), 100, "Receivers balance is incorrect")
        })

        it("doesn't transfer to contract address", async () => {
            const maxGasAvailable = 4000000
            await TestUtils.assertThrows(() => erc223Token.transfer(erc223Token.address, 100, {gas: maxGasAvailable}), maxGasAvailable)
            const acc0Balance = await erc223Token.balanceOf(accounts[0])

            assert.equal(acc0Balance.toNumber(), 1000, "Senders balance is incorrect")
        })

        it("does transfer to contract address with a tokenFallback() function implemented", async () => {
            await erc223Token.transfer(tokenReceiver.address, 100)
            const acc0Balance = await erc223Token.balanceOf(accounts[0])
            const tokenReceiverBalance = await erc223Token.balanceOf(tokenReceiver.address)

            assert.equal(acc0Balance.toNumber(), 900, "Senders balance is incorrect")
            assert.equal(tokenReceiverBalance.toNumber(), 100, "Receivers balance is incorrect")
        })
    })

})