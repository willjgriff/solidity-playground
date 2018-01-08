const StandardNonFungibleToken = artifacts.require("StandardNonFungibleToken.sol")


contract("StandardNonFungibleToken", accounts => {

    let standardNonFungibleToken

    beforeEach(async () => standardNonFungibleToken = await StandardNonFungibleToken.new())

    describe("balanceOf()", () => {

        it("acc0 is initially zero", async () => {
            const acc0Balance = await standardNonFungibleToken.balanceOf(accounts[0])
            console.log(acc0Balance)
            assert.equal(acc0Balance, 0)
        })

    })

})