const MiniMeTokenFactory = artifacts.require("MiniMeToken.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")

contract("MiniMeToken", accounts => {

    let miniMeTokenFactory, miniMeToken

    beforeEach(() => {
        return MiniMeTokenFactory.new()
            .then(_miniMeTokenFactory => {
                miniMeTokenFactory = _miniMeTokenFactory
                return MiniMeToken.new(miniMeTokenFactory.address, 0, 0, "TestToken", 18, "TTN", true)
            })
            .then(_miniMeToken => miniMeToken = _miniMeToken)
    })

    describe("generateTokens(address, uint)", () => {

        it("generates expected tokens", () => {
            return miniMeToken.generateTokens(accounts[1], 1000)
                .then(() => miniMeToken.balanceOf(accounts[1]))
                .then(acc1balance => assert.equal(acc1balance, 1000, "Acc1 balance is incorrect, did not generate tokens"))
        })
    })

    describe("destroyTokens(owner, amount")
})