const LinkedList = artifacts.require("LinkedList.sol")
const LiquidVote = artifacts.require("LiquidVote.sol")

contract("LiquidVote", accounts => {

    let liquidVote
    const acc0 = accounts[0]
    const acc1 = accounts[1]

    beforeEach(async () => {
        LiquidVote.link("LinkedList", LinkedList.address)
        liquidVote = await LiquidVote.new()
    })

    describe("vote(bool _voteDirection)", () => {

        it("updates voter with having voted and correct descision", async () => {
            await liquidVote.vote(true)
            const voter = await liquidVote.getVoter(web3.eth.accounts[0])

            assert.isTrue(voter[0], "Vote direction not as expected")
            assert.isTrue(voter[1], "Has voted bool not as expected")
        })
    })

    describe("delegateVote(address delegateToAddress, uint previousNodePosition)", () => {

        it("updates delegated to address and adds to delegated from list of delegated voter", async () => {
            const previousNodePosition = await liquidVote.getPreviousNodeIdForDelegate(acc0)
            await liquidVote.delegateVote(acc1, previousNodePosition)
            const originalVoter = await liquidVote.getVoter(acc0)
            const delegatedToVoter = await liquidVote.getVoter(acc1)
            
            assert.isFalse(originalVoter[1], "Has voted bool not as expected")
            assert.equal(originalVoter[2], acc1, "Delegated to is not as expected")
            assert.equal(originalVoter[3], 0, "Delegated from has increased")
            assert.equal(delegatedToVoter[3], 1, "Delegated from has not increased")
        })
    })
})