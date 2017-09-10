const ERC23Token = artifacts.require("./StandardERC23Token.sol")
const TokenReceiver = artifacts.require("./StandardERC23Receiver.sol");
const Utils = require("./TestUtils.js")

contract("ERC23Token", accounts => {

    let erc23Token, tokenReceiver;

    beforeEach(() => {
        return ERC23Token.new(1000, {from: accounts[0]})
            .then(instance => {
                erc23Token = instance
                return TokenReceiver.new()
            })
            .then(instance => tokenReceiver = instance)
    })

    describe("transfer(address to, uint value)", () => {

        it("transfers to a normal account", () => {
            return erc23Token.transfer(accounts[1], 100)
                .then(() => erc23Token.balanceOf(accounts[0]))
                .then(acc0Balance => assert.equal(acc0Balance.toNumber(), 900, "Senders balance is incorrect"))
                .then(() => erc23Token.balanceOf(accounts[1]))
                .then(acc1Balance => assert.equal(acc1Balance.toNumber(), 100, "Receivers balance is incorrect"))
        })

        it("doesn't transfer to contract address", () => {
            return Utils.assertThrows(() => erc23Token.transfer(erc23Token.address, 100), 1000000)
                .then(() => erc23Token.balanceOf(accounts[0]))
                .then(acc0Balance => assert.equal(acc0Balance.toNumber(), 1000, "Senders balance is incorrect"))
        })

        it("does transfer to contract address with a tokenFallback() function implemented", () => {
            return erc23Token.transfer(tokenReceiver.address, 100)
                .then(() => erc23Token.balanceOf(accounts[0]))
                .then(acc0Balance => assert.equal(acc0Balance.toNumber(), 900, "Senders balance is incorrect"))
                .then(() => erc23Token.balanceOf(tokenReceiver.address))
                .then(tokenReceiver => assert.equal(tokenReceiver.toNumber(), 100, "Receivers balance is incorrect"))
        })
    })

})