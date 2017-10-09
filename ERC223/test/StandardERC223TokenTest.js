const ERC223Token = artifacts.require("./StandardERC223Token.sol")
const TokenReceiver = artifacts.require("./StandardERC223Receiver.sol");
const TestUtils = require("../../TestUtils.js")

contract("ERC223Token", accounts => {

    let erc223Token, tokenReceiver;

    beforeEach(() => {
        return ERC223Token.new(1000, {from: accounts[0]})
            .then(instance => {
                erc223Token = instance
                return TokenReceiver.new()
            })
            .then(instance => tokenReceiver = instance)
    })

    describe("transfer(address to, uint value)", () => {

        it("transfers to a normal account", () => {
            return erc223Token.transfer(accounts[1], 100)
                .then(() => erc223Token.balanceOf(accounts[0]))
                .then(acc0Balance => assert.equal(acc0Balance.toNumber(), 900, "Senders balance is incorrect"))
                .then(() => erc223Token.balanceOf(accounts[1]))
                .then(acc1Balance => assert.equal(acc1Balance.toNumber(), 100, "Receivers balance is incorrect"))
        })

        it("doesn't transfer to contract address", () => {
            const maxGasAvailable = 4000000
            return TestUtils.assertThrows(() => erc223Token.transfer(erc223Token.address, 100, {gas: maxGasAvailable}), maxGasAvailable)
                .then(() => erc223Token.balanceOf(accounts[0]))
                .then(acc0Balance => assert.equal(acc0Balance.toNumber(), 1000, "Senders balance is incorrect"))
        })

        it("does transfer to contract address with a tokenFallback() function implemented", () => {
            return erc223Token.transfer(tokenReceiver.address, 100)
                .then(() => erc223Token.balanceOf(accounts[0]))
                .then(acc0Balance => assert.equal(acc0Balance.toNumber(), 900, "Senders balance is incorrect"))
                .then(() => erc223Token.balanceOf(tokenReceiver.address))
                .then(tokenReceiver => assert.equal(tokenReceiver.toNumber(), 100, "Receivers balance is incorrect"))
        })
    })

})