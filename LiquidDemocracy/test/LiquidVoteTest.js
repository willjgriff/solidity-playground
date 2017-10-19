const ArrayLib = artifacts.require("ArrayLib.sol")
const LiquidVote = artifacts.require("LiquidVote.sol")
const TestUtils = require("../../TestUtils")

contract("LiquidVote", accounts => {

    let liquidVote

    beforeEach(async () => {
        LiquidVote.link("ArrayLib", ArrayLib.address)
        liquidVote = await LiquidVote.new()
    })

    describe("vote(bool _voteDirection)", () => {

        it("updates voter with having voted and correct descision", async () => {
            await liquidVote.vote(true)
            const voter = await liquidVote.getVoter(accounts[0])

            assert.isTrue(voter[0], "Vote direction not as expected")
            assert.isTrue(voter[2], "Has voted bool not as expected")
        })
    })

    describe("delegateVote(address delegateToAddress, uint previousNodePosition)", () => {

        const delegateFrom = accounts[0]
        const delegateTo = accounts[1]

        it("updates delegated from voter as expected", async () => {
            await liquidVote.delegateVote(delegateTo, {from: delegateFrom})
            const originalVoter = await liquidVote.getVoter(delegateFrom)

            assert.isFalse(originalVoter[2], "Has voted bool not as expected")
            assert.equal(originalVoter[3], delegateTo, "Delegated to is not as expected")
            assert.equal(originalVoter[4], 0, "Delegated from array position should be 0")
            assert.equal(originalVoter[5], 0, "Delegated from array has increased in size")
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

            Array.from(new Array(8).keys())
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
            const expectedVoter = await liquidVote.getVoter(delegateFrom)

            await liquidVote.delegateVote(delegateTo2, {from: delegateTo})
            await liquidVote.delegateVote(delegateFrom, {from: delegateFrom2})
            const actualVoter = await liquidVote.getVoter(delegateFrom)

            assert.equal(actualVoter[3], expectedVoter[3], "Voters are not the same")
        })

    })
})