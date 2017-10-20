const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const ArrayLib = artifacts.require("ArrayLib.sol")
const LiquidVote = artifacts.require("LiquidVote.sol")
const TestUtils = require("../../TestUtils")

contract("LiquidVote", accounts => {

    let voteToken, liquidVote

    beforeEach(async () => {
        miniMeTokenFactory = await MiniMeTokenFactory.new()
        voteToken = await MiniMeToken.new(miniMeTokenFactory.address, 0, 0, "Vote Token", 18, "VTT", true)
        LiquidVote.link("ArrayLib", ArrayLib.address)
        liquidVote = await LiquidVote.new(voteToken.address)
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
    })

    describe("delegateVote(address delegateToAddress, uint previousNodePosition)", () => {

        const delegateFrom = accounts[0]
        const delegateTo = accounts[1]

        it("updates delegated from voter as expected", async () => {
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            const originalVoter = await liquidVote.voters(delegateFrom)

            assert.isFalse(originalVoter[2], "Has voted bool not as expected")
            assert.equal(originalVoter[3], delegateTo, "Delegated to is not as expected")
            assert.equal(originalVoter[4], 0, "Delegated from array position should be 0")
        })

        it("updates delegated from list of delegated voter", async () => {
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            const delegatedFromVoters = await liquidVote.getDelegatedFromVotersForVoter(delegateTo)

            assert.deepEqual(delegatedFromVoters, [delegateFrom], "Delegated from array is not as expected")
        })

        it("updates delegated from list of delegated voter with multiple voters", async () => {
            const delegateFrom2 = accounts[2]
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom2})
            const delegatedFromVoters = await liquidVote.getDelegatedFromVotersForVoter(delegateTo)

            assert.deepEqual(delegatedFromVoters, [delegateFrom, delegateFrom2], "Delegated from array is not as expected")
        })

        it("removes currently delegated to address when delegating to a new address", async () => {
            const delegateTo2 = accounts[2]
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            await liquidVote.delegateVote(delegateTo2, {from: delegateFrom})
            const delegatedFromVoters = await liquidVote.getDelegatedFromVotersForVoter(delegateTo)
            const delegatedFromVoters2 = await liquidVote.getDelegatedFromVotersForVoter(delegateTo2)

            assert.deepEqual(delegatedFromVoters, [], "Delegated from array for delegate 1 is not as expected")
            assert.deepEqual(delegatedFromVoters2, [delegateFrom], "Delegated from array for delegate 2 is not as expected")
        })

        // it("fails when attempting to delegate to the same address twice", async () => {
        //     const maxGas = 400000
        //     await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
        //
        //     await TestUtils.assertThrows(() => liquidVote.delegateVote(delegateTo, {from: delegateFrom, gas: maxGas}), maxGas)
        // })

        it("fails when attempting circular delegation", async () => {
            const maxGas = 400000
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})

            await TestUtils.assertThrows(() => liquidVote.delegateVote(delegateFrom, {from: delegateTo, gas: maxGas}), maxGas)
        })

        it("fails when attempting circular delegation with 3 delegations", async () => {
            const delegateTo2 = accounts[2]
            const maxGas = 400000
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            await liquidVote.delegateVote(delegateTo2, {from: delegateTo})

            await TestUtils.assertThrows(() => liquidVote.delegateVote(delegateFrom, {from: delegateTo2, gas: maxGas}), maxGas)
        })

        it("gas increase for 3 chained delegations is less than 3000 gas", async () => {
            const delegateTo2 = accounts[2]
            const delegateFrom2 = accounts[3]
            const tx = await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            await liquidVote.delegateVote(delegateTo2, {from: delegateTo})
            const tx3 = await liquidVote.delegateVote(delegateFrom, {from: delegateFrom2})

            const gasDifference = tx3.receipt.gasUsed - tx.receipt.gasUsed
            assert.isBelow(gasDifference, 3000, "Gas increase is more than 2000")
            // console.log("Final diff: " + gasDifference)

        })

        it("gas increase for 10 chained delegations is less than 9000 gas", async () => {
            let gasForCheapestCall = 0

            await Array.from(new Array(8).keys())
                .forEach(async accountNumber => {
                    const tx = await liquidVote.delegateVote(accounts[accountNumber + 1], {from: accounts[accountNumber]})
                    gasForCheapestCall = tx.receipt.gasUsed
                })

            // Note, we haven't delegated acc8 to acc9 so acc9 can delegate to acc0 without a circular delegation
            const finalTx = await liquidVote.delegateVote(accounts[0], {from: accounts[9]})

            const gasDifference = finalTx.receipt.gasUsed - gasForCheapestCall
            assert.isBelow(gasDifference, 9000, "Gas increase for 10 delegations is more than 9000 gas")
            // console.log("Final diff: " + gasDifference)
        })

        // Test mainly to help understand how storage references work.
        // Checking the process of checking for circular delegation doesn't change storage.
        it("voter is the same before and after delegateVote call that checks for circular delegation", async () => {
            const delegateTo2 = accounts[2]
            const delegateFrom2 = accounts[3]
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            const expectedVoter = await liquidVote.voters(delegateFrom)

            await liquidVote.delegateVote(delegateTo2, {from: delegateTo})
            await liquidVote.delegateVote(delegateFrom, {from: delegateFrom2})
            const actualVoter = await liquidVote.voters(delegateFrom)

            assert.equal(actualVoter[3], expectedVoter[3], "Voters are not the same")
        })

    })

    describe("voteWeightOfAddress(address voterAddress)", () => {

        it("calculates correct weight for single voter", async () => {
            const voterAddress = accounts[1]
            const expectedWeight = 1000
            await voteToken.generateTokens(voterAddress, expectedWeight)
            const actualWeight = await liquidVote.voteWeightOfAddress(voterAddress)

            assert.equal(actualWeight, expectedWeight, "Voter weight is not as expected")
        })

        // TODO: A check needs to be added to prevent a user voting who has delegated their vote.
        it("calculates correct weight for voter with 1 delegated from address", async () => {
            const expectedWeight = 1500
            const voterAddress1 = accounts[1]
            const voterAddress2 = accounts[2]
            await voteToken.generateTokens(voterAddress1, 1000)
            await voteToken.generateTokens(voterAddress2, 500)

            await liquidVote.delegateVote(accounts[1], {from: accounts[2]})
            const actualWeight = await liquidVote.voteWeightOfAddress(voterAddress1)

            assert.equal(actualWeight, expectedWeight, "Voter weight is not as expected")
        })

        it("calculates correct weight for voter with 2 delegated from addresses", async () => {
            const expectedWeight = 1500
            const delegatedToVoter = accounts[5]
            await voteToken.generateTokens(delegatedToVoter, 500)
            for (let accountNumber = 0; accountNumber < 2; accountNumber++) {
                await voteToken.generateTokens(accounts[accountNumber], 500)
                await liquidVote.delegateVote(delegatedToVoter, {from: accounts[accountNumber]})
            }
            const actualWeight = await liquidVote.voteWeightOfAddress(delegatedToVoter)

            assert.equal(actualWeight, expectedWeight, "Voter weight is not as expected")
        })

        it("calculates correct weight for voter with 9 delegated from addresses", async () => {
            const expectedWeight = 1000 + 500 * 9
            const delegatedToVoter = accounts[0]
            await voteToken.generateTokens(delegatedToVoter, 1000)
            for (let accountNumber = 1; accountNumber < 10; accountNumber++) {
                await voteToken.generateTokens(accounts[accountNumber], 500)
                await liquidVote.delegateVote(delegatedToVoter, {from: accounts[accountNumber]})
            }
            const actualWeight = await liquidVote.voteWeightOfAddress(delegatedToVoter)

            assert.equal(actualWeight, expectedWeight, "Voter weight is not as expected")
        })
    })
})