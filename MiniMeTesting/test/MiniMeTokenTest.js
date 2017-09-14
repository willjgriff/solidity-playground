const MiniMeTokenFactory = artifacts.require("./MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const TestUtils = require("../../TestUtils.js")

contract("MiniMeToken", accounts => {

    let miniMeTokenFactory, miniMeToken

    beforeEach(() => {
        return MiniMeTokenFactory.new()
            .then(_miniMeTokenFactory => {
                miniMeTokenFactory = _miniMeTokenFactory
                return MiniMeToken.new(miniMeTokenFactory.address, 0, 0, "TestToken", 18, "TTN", true)
            })
            .then(_miniMeToken => {
                miniMeToken = _miniMeToken
                return miniMeToken.generateTokens(accounts[1], 1000)
            })
    })

    describe("generateTokens(address, uint)", () => {

        it("generates expected tokens", () => {
            return  miniMeToken.balanceOf(accounts[1])
                .then(acc1balance => assert.equal(acc1balance, 1000, "Acc1 balance is incorrect, did not generate tokens"))
        })
    })

    describe("destroyTokens(address, uint", () => {

        it("destroys expected tokens", () => {
            return miniMeToken.destroyTokens(accounts[1], 100)
                .then(() => miniMeToken.balanceOf(accounts[1]))
                .then(acc1balance => assert.equal(acc1balance, 900, "Acc1 balance is incorrect, did not destroy tokens"))
        })
    })

    describe("copying MiniMe token via constructor", () => {

        it("copies balances", () => {
            return MiniMeToken.new(miniMeTokenFactory.address, miniMeToken.address, web3.eth.blockNumber, "TestTokenCopy", 18, "TT2", true)
                .then(miniMeTokenCopy => miniMeTokenCopy.balanceOf(accounts[1]))
                .then(copiedAcc1Balance => assert.equal(copiedAcc1Balance, 1000, "Acc1 balance is incorrect, token was not copied successfully"))
        })
    })

    describe("createCloneToken(string cloneTokenName, uint8 cloneDecimalUnits, " +
        "string cloneTokenSymbol, uint snapshotBlock, bool transfersEnabled)", () => {

        it("copies balances", () => {

            return miniMeToken.createCloneToken("TestTokenCopy", 18, "TT2", 0, true)
                .then(() => TestUtils.listenForEvent(miniMeToken.NewCloneToken()))
                .then(newCloneTokenEventArgs => MiniMeToken.at(newCloneTokenEventArgs._cloneToken).balanceOf(accounts[1]))
                .then(copiedAcc1Balance => assert.equal(copiedAcc1Balance, 1000, "Acc1 balance is incorrect, token was not copied successfully"))
        })
    })

    // The more times its copied, the greater the gas cost of transfer will be, I think... calls recursively.
})