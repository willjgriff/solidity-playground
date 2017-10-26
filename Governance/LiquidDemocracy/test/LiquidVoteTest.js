const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const ArrayLib = artifacts.require("ArrayLib.sol")
const LiquidVote = artifacts.require("LiquidVote.sol")
const DelegationRegistry = artifacts.require("DelegationRegistry.sol")
const TestUtils = require("../../Utils/TestUtils")

contract("LiquidVote", accounts => {

    let voteToken, delegationRegistry, liquidVote

    beforeEach(async () => {
        miniMeTokenFactory = await MiniMeTokenFactory.new()
        voteToken = await MiniMeToken.new(miniMeTokenFactory.address, 0, 0, "Vote Token", 18, "VTT", true)

        DelegationRegistry.link("ArrayLib", ArrayLib.address)
        delegationRegistry = await DelegationRegistry.new()

        LiquidVote.link("ArrayLib", ArrayLib.address)
        liquidVote = await LiquidVote.new(voteToken.address, delegationRegistry.address)
    })

    describe("vote(bool _voteDirection)", () => {

        it("updates voter with having voted and correct decision", async () => {
            await liquidVote.vote(true)
            const voter = await liquidVote.voters(accounts[0])

            assert.isTrue(voter[0], "Vote direction not as expected")
            assert.equal(voter[1], 0, "Vote direction array position not as expected")
            assert.isTrue(voter[2], "Has voted bool not as expected")
        })

        it("updates voter with having voted and correct decision after 2 votes are cast for same decision", async () => {
            await liquidVote.vote(true, {from:accounts[0]})
            await liquidVote.vote(true, {from:accounts[1]})
            const voter2 = await liquidVote.voters(accounts[1])

            assert.isTrue(voter2[0], "Vote direction not as expected")
            assert.equal(voter2[1].toNumber(), 1, "Vote direction array position not as expected")
            assert.isTrue(voter2[2], "Has voted bool not as expected")
        })

        it("updates voted for address array", async () => {
            await liquidVote.vote(true, {from:accounts[0]})
            await liquidVote.vote(true, {from:accounts[1]})
            const expectedVotedForAddresses = [accounts[0], accounts[1]]
            const actualVotedForAddresses = await liquidVote.getVotedForAddresses()

            assert.deepEqual(actualVotedForAddresses, expectedVotedForAddresses, "Voted for addresses are not as expected")
        })

        it("updates voted against address array", async () => {
            await liquidVote.vote(false, {from:accounts[0]})
            await liquidVote.vote(false, {from:accounts[1]})
            const expectedVotedForAddresses = [accounts[0], accounts[1]]
            const actualVotedForAddresses = await liquidVote.getVotedAgainstAddresses()

            assert.deepEqual(actualVotedForAddresses, expectedVotedForAddresses, "Voted for addresses are not as expected")
        })

        it("removes address from voted for address array when vote is changed", async () => {
            await liquidVote.vote(true, {from:accounts[0]})
            await liquidVote.vote(false, {from:accounts[0]})
            const votedForAddresses = await liquidVote.getVotedForAddresses();
            const votedAgainstAddresses = await liquidVote.getVotedAgainstAddresses();

            assert.deepEqual(votedForAddresses, [], "Voted for addresses are not as expected")
            assert.deepEqual(votedAgainstAddresses, [accounts[0]], "Voted against addresses are not as expected")
        })

        it("removes address from voted against address array when vote is changed", async () => {
            await liquidVote.vote(false, {from:accounts[0]})
            await liquidVote.vote(true, {from:accounts[0]})
            const votedForAddresses = await liquidVote.getVotedForAddresses();
            const votedAgainstAddresses = await liquidVote.getVotedAgainstAddresses();

            assert.deepEqual(votedForAddresses, [accounts[0]], "Voted for addresses are not as expected")
            assert.deepEqual(votedAgainstAddresses, [], "Voted against addresses are not as expected")
        })

        it("fails when voter has delegated their vote", async () => {
            const maxGas = 1000000
            await delegationRegistry.delegateVote(accounts[1])
            await TestUtils.assertThrows(() => liquidVote.vote(true, {gas: maxGas}), maxGas)
        })
    })

})