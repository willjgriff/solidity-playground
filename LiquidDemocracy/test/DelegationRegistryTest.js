const MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory.sol")
const MiniMeToken = artifacts.require("MiniMeToken.sol")
const ArrayLib = artifacts.require("ArrayLib.sol")
const DelegationRegistry = artifacts.require("DelegationRegistry.sol")
const TestUtils = require("../../TestUtils")

contract("DelegationRegistry", accounts => {

    let delegationRegistry

    beforeEach(async () => {
        DelegationRegistry.link("ArrayLib", ArrayLib.address)
        delegationRegistry = await DelegationRegistry.new()
    })

    // describe("delegateVote(address delegateToAddress, uint previousNodePosition)", () => {
    //
    //     const delegateFrom = accounts[0]
    //     const delegateTo = accounts[1]
    //
    //     it("updates delegated from voter as expected", async () => {
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         const originalVoter = await delegationRegistry.delegatedVoters(delegateFrom)
    //
    //         assert.equal(originalVoter[0], delegateTo, "Delegated to is not as expected")
    //         assert.equal(originalVoter[1], 0, "Delegated from array position should be 0")
    //     })
    //
    //     it("updates delegated from list of delegated voter", async () => {
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         const delegatedFromVoters = await delegationRegistry.getDelegatedFromAddressesForVoter(delegateTo)
    //
    //         assert.deepEqual(delegatedFromVoters, [delegateFrom], "Delegated from array is not as expected")
    //     })
    //
    //     it("updates delegated from list of delegated voter with multiple voters", async () => {
    //         const delegateFrom2 = accounts[2]
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom2})
    //         const delegatedFromVoters = await delegationRegistry.getDelegatedFromAddressesForVoter(delegateTo)
    //
    //         assert.deepEqual(delegatedFromVoters, [delegateFrom, delegateFrom2], "Delegated from array is not as expected")
    //     })
    //
    //     it("removes currently delegated to address when delegating to a new address", async () => {
    //         const delegateTo2 = accounts[2]
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         await delegationRegistry.delegateVote(delegateTo2, {from: delegateFrom})
    //         const delegatedFromVoters = await delegationRegistry.getDelegatedFromAddressesForVoter(delegateTo)
    //         const delegatedFromVoters2 = await delegationRegistry.getDelegatedFromAddressesForVoter(delegateTo2)
    //
    //         assert.deepEqual(delegatedFromVoters, [], "Delegated from array for delegate 1 is not as expected")
    //         assert.deepEqual(delegatedFromVoters2, [delegateFrom], "Delegated from array for delegate 2 is not as expected")
    //     })
    //
    //     // it("fails when attempting to delegate to the same address twice", async () => {
    //     //     const maxGas = 400000
    //     //     await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //     //
    //     //     await TestUtils.assertThrows(() => delegationRegistry.delegateVote(delegateTo, {from: delegateFrom, gas: maxGas}), maxGas)
    //     // })
    //
    //     // TODO: Test delegation to self.
    //
    //     it("fails when attempting circular delegation", async () => {
    //         const maxGas = 400000
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //
    //         await TestUtils.assertThrows(() => delegationRegistry.delegateVote(delegateFrom, {from: delegateTo, gas: maxGas}), maxGas)
    //     })
    //
    //     it("fails when attempting circular delegation with 3 delegations", async () => {
    //         const delegateTo2 = accounts[2]
    //         const maxGas = 400000
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         await delegationRegistry.delegateVote(delegateTo2, {from: delegateTo})
    //
    //         await TestUtils.assertThrows(() => delegationRegistry.delegateVote(delegateFrom, {from: delegateTo2, gas: maxGas}), maxGas)
    //     })
    //
    //     it("gas increase for 3 chained delegations is less than 3000 gas", async () => {
    //         const delegateTo2 = accounts[2]
    //         const delegateFrom2 = accounts[3]
    //         const tx = await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         await delegationRegistry.delegateVote(delegateTo2, {from: delegateTo})
    //         const tx3 = await delegationRegistry.delegateVote(delegateFrom, {from: delegateFrom2})
    //
    //         const gasDifference = tx3.receipt.gasUsed - tx.receipt.gasUsed
    //         assert.isBelow(gasDifference, 3000, "Gas increase is more than 2000")
    //         // console.log("Final diff: " + gasDifference)
    //
    //     })
    //
    //     it("gas increase for 10 chained delegations is less than 9000 gas", async () => {
    //         let gasForCheapestCall = 0
    //
    //         await Array.from(new Array(8).keys())
    //             .forEach(async accountNumber => {
    //                 const tx = await delegationRegistry.delegateVote(accounts[accountNumber + 1], {from: accounts[accountNumber]})
    //                 gasForCheapestCall = tx.receipt.gasUsed
    //             })
    //
    //         // Note, we haven't delegated acc8 to acc9 so acc9 can delegate to acc0 without a circular delegation
    //         const finalTx = await delegationRegistry.delegateVote(accounts[0], {from: accounts[9]})
    //
    //         const gasDifference = finalTx.receipt.gasUsed - gasForCheapestCall
    //         assert.isBelow(gasDifference, 9000, "Gas increase for 10 delegations is more than 9000 gas")
    //         // console.log("Final diff: " + gasDifference)
    //     })
    //
    //     // Test mainly to help understand how storage references work.
    //     // Checking the process of checking for circular delegation doesn't change storage.
    //     it("voter is the same before and after delegateVote call that checks for circular delegation", async () => {
    //         const delegateTo2 = accounts[2]
    //         const delegateFrom2 = accounts[3]
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         const expectedVoter = await delegationRegistry.delegatedVoters(delegateFrom)
    //
    //         await delegationRegistry.delegateVote(delegateTo2, {from: delegateTo})
    //         await delegationRegistry.delegateVote(delegateFrom, {from: delegateFrom2})
    //         const actualVoter = await delegationRegistry.delegatedVoters(delegateFrom)
    //
    //         assert.equal(actualVoter[3], expectedVoter[3], "Voters are not the same")
    //     })
    //
    //     it("sets correct new index for address moved in the delegatedVoter's fromAddresses array", async () => {
    //         const delegateFrom1 = accounts[0]
    //         const delegateFrom2 = accounts[1]
    //         const delegateTo = accounts[2]
    //
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom1})
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom2})
    //         await delegationRegistry.delegateVote(accounts[3], {from: delegateFrom1})
    //         const delegateFrom2Voter = await delegationRegistry.delegatedVoters(delegateFrom2)
    //
    //         assert.equal(delegateFrom2Voter[1].toNumber(), 0, "Delegate from 2 voter from addresses index should be 0")
    //     })
    //
    // })
    //
    // describe("undelegateVote(address delegatedVoterAddress)", () => {
    //
    //     it("undelegates vote", async () => {
    //         const delegateFrom = accounts[0]
    //         const delegateTo = accounts[1]
    //
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom})
    //         await delegationRegistry.undelegateVote({from: delegateFrom})
    //         const delegatedToAddress = await delegationRegistry.getDelegatedVoterToAddress(delegateFrom)
    //         const delegatedFromAddresses = await delegationRegistry.getDelegatedFromAddressesForVoter(delegateTo)
    //
    //         assert.equal(delegatedToAddress, 0, "Delegated to address should be 0")
    //         assert.deepEqual(delegatedFromAddresses, [], "Delegated from addresses should be empty")
    //     })
    //
    //     it("sets correct new index for address moved in the delegatedVoter's fromAddresses array", async () => {
    //         const delegateFrom1 = accounts[0]
    //         const delegateFrom2 = accounts[1]
    //         const delegateTo = accounts[2]
    //
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom1})
    //         await delegationRegistry.delegateVote(delegateTo, {from: delegateFrom2})
    //         await delegationRegistry.undelegateVote({from: delegateFrom1})
    //         const delegateFrom2Voter = await delegationRegistry.delegatedVoters(delegateFrom2)
    //
    //         assert.equal(delegateFrom2Voter[1].toNumber(), 0, "Delegate from 2 voter from addresses index should be 0")
    //     })
    // })
    //
    // describe("voteWeightOfAddress(address voterAddress) root registry tests", () => {
    //
    //     let voteToken
    //
    //     beforeEach(async () => {
    //         miniMeTokenFactory = await MiniMeTokenFactory.new()
    //         voteToken = await MiniMeToken.new(miniMeTokenFactory.address, 0, 0, "Vote Token", 18, "VTT", true)
    //     })
    //
    //     it("calculates correct weight for single voter", async () => {
    //         const voterAddress = accounts[1]
    //         const expectedWeight = 1000
    //         await voteToken.generateTokens(voterAddress, expectedWeight)
    //         const actualWeight = await delegationRegistry.voteWeightOfAddress(voterAddress, voteToken.address)
    //
    //         assert.equal(actualWeight.toNumber(), expectedWeight, "Voter weight is not as expected")
    //     })
    //
    //     it("calculates correct weight for voter with 1 delegated from address", async () => {
    //         const expectedWeight = 1500
    //         const voterAddress1 = accounts[1]
    //         const voterAddress2 = accounts[2]
    //         await voteToken.generateTokens(voterAddress2, 500)
    //         await voteToken.generateTokens(voterAddress1, 1000)
    //
    //         await delegationRegistry.delegateVote(accounts[1], {from: accounts[2]})
    //         const actualWeight = await delegationRegistry.voteWeightOfAddress(voterAddress1, voteToken.address)
    //
    //         assert.equal(actualWeight.toNumber(), expectedWeight, "Voter weight is not as expected")
    //     })
    //
    //     it("calculates correct weight for voter with 2 delegated from addresses", async () => {
    //         const expectedWeight = 1500
    //         const delegatedToVoter = accounts[5]
    //         await voteToken.generateTokens(delegatedToVoter, 500)
    //         await generateTokensForAccountsAndDelegateTo(0, 2, delegatedToVoter, voteToken)
    //         const actualWeight = await delegationRegistry.voteWeightOfAddress(delegatedToVoter, voteToken.address)
    //
    //         assert.equal(actualWeight.toNumber(), expectedWeight, "Voter weight is not as expected")
    //     })
    //
    //     it("calculates correct weight for voter with 9 delegated from addresses", async () => {
    //         const expectedWeight = 1000 + 500 * 9
    //         const delegatedToVoter = accounts[0]
    //         await voteToken.generateTokens(delegatedToVoter, 1000)
    //         await generateTokensForAccountsAndDelegateTo(1, 10, delegatedToVoter, voteToken)
    //         const actualWeight = await delegationRegistry.voteWeightOfAddress(delegatedToVoter, voteToken.address)
    //
    //         assert.equal(actualWeight.toNumber(), expectedWeight, "Voter weight is not as expected")
    //     })
    //
    //     it("calculates correct weight with 2 layers of delgation", async () => {
    //         const expectedWeight = 1000 + 500 * 2
    //         const rootDelegate = accounts[0]
    //         await voteToken.generateTokens(rootDelegate, 1000)
    //         await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
    //         await generateTokensForAccountsAndDelegateTo(2, 3, accounts[1], voteToken)
    //         const actualWeight = await delegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)
    //
    //         assert.equal(actualWeight.toNumber(), expectedWeight, "Voter weight is not as expected")
    //     })
    //
    //     it("calculates correct weight with multiple layers of delegation and multiple delegations within each", async () => {
    //         const expectedWeight = 1000 + 500 * 8
    //         const rootDelegate = accounts[0]
    //         await voteToken.generateTokens(rootDelegate, 1000)
    //         await generateTokensForAccountsAndDelegateTo(1, 3, rootDelegate, voteToken)
    //         await generateTokensForAccountsAndDelegateTo(3, 6, accounts[1], voteToken)
    //         await generateTokensForAccountsAndDelegateTo(6, 9, accounts[2], voteToken)
    //         const actualWeight = await delegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)
    //
    //         assert.equal(actualWeight.toNumber(), expectedWeight, "Voter weight is not as expected")
    //     })
    //
    // })

    describe("voteWeightOfAddress(address voterAddress) child registry tests", () => {

        let voteToken

        beforeEach(async () => {
            miniMeTokenFactory = await MiniMeTokenFactory.new()
            voteToken = await MiniMeToken.new(miniMeTokenFactory.address, 0, 0, "Vote Token", 18, "VTT", true)
        })

        it("calculates correct weight in child registry for single voter", async () => {
            const expectedWeight = 1000
            const voterAddress = accounts[0]
            await voteToken.generateTokens(voterAddress, 1000)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(voterAddress, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Vote weight is not as expected")
        })

        it("calculates correct weight in child registry with 1 delegated voter", async () => {
            const expectedWeight = 1500
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Vote weight is not as expected")
        })

        it("calculates correct weight in child registry with 2 delegated voters", async () => {
            const expectedWeight = 2000
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 3, rootDelegate, voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Vote weight is not as expected")
        })

        it("calculates correct weight in child registry when new voter delegates vote", async () => {
            const expectedWeight = 1500
            const rootDelegate = accounts[0]
            const newVoter = accounts[1]
            await voteToken.generateTokens(rootDelegate, 1000)
            await voteToken.generateTokens(newVoter, 1000)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await childDelegationRegistry.delegateVote(rootDelegate, {from: newVoter})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Vote weight is not as expected")
        })

        // Straying away from unit testing here... (As if I wasn't above anyway this jazz requires a lot of setup)
        it("calculates correct weight in child registry after voter undelegates in child", async () => {
            const expectedWeight = 1000
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await childDelegationRegistry.undelegateVote({from: accounts[1]})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Vote weight is not as expected")
        })

        it("calculates correct weight in child registry after voter redelegates in child", async () => {
            const expectedWeight = 1500
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await childDelegationRegistry.undelegateVote({from: accounts[1]})
            await childDelegationRegistry.delegateVote(rootDelegate, {from: accounts[1]})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Vote weight is not as expected")
        })

        it("calculates correct weight in child registry when new delegation is added in child", async () => {
            const expectedWeight = 2000
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await voteToken.generateTokens(accounts[2], 500)
            await childDelegationRegistry.delegateVote(accounts[1], {from: accounts[2]})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Vote weight is not as expected")
        })

        it("calculates correct weight in child registry with 2 layers of delegation", async () => {
            const expectedWeight = 1000 + 2 * 500
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            await generateTokensForAccountsAndDelegateTo(2, 3, accounts[1], voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight, expectedWeight, "Root delegate weight was not as expected")
        })

        it("calculates correct weight in child registry with 2 layers of delegation and lowest level undelegating", async () => {
            const expectedWeight = 1000
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            await generateTokensForAccountsAndDelegateTo(2, 3, accounts[1], voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await childDelegationRegistry.undelegateVote({from: accounts[1]})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight, expectedWeight, "Root delegate weight was not as expected")
        })

        it("calculates correct weight in child registry with 2 layers of delegation and highest level undelegating", async () => {
            const expectedWeight = 1500
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            await generateTokensForAccountsAndDelegateTo(2, 3, accounts[1], voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await childDelegationRegistry.undelegateVote({from: accounts[2]})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight, "Root delegate weight was not as expected")
        })

        it("calculates correct weight in child registry with 2 layers of delegation and lowest level redelegating", async () => {
            const expectedWeight = 2000
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            await generateTokensForAccountsAndDelegateTo(2, 3, accounts[1], voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await childDelegationRegistry.delegateVote(rootDelegate, {from: accounts[1]})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight, expectedWeight, "Root delegate weight was not as expected")
        })

        it("calculates correct weight in child registry with 2 layers of delegation and highest level redelegating", async () => {
            const expectedWeight = 2000
            const rootDelegate = accounts[0]
            await voteToken.generateTokens(rootDelegate, 1000)
            await generateTokensForAccountsAndDelegateTo(1, 2, rootDelegate, voteToken)
            await generateTokensForAccountsAndDelegateTo(2, 3, accounts[1], voteToken)
            const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
            await childDelegationRegistry.delegateVote(accounts[1], {from: accounts[2]})
            const actualWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)

            assert.equal(actualWeight, expectedWeight, "Root delegate weight was not as expected")
        })

        // it("calculates correct weight in child registry with 2 delegate voters after 1 voter undelegates", async () => {
        //     const expectedRootDelegateWeight = 1500
        //     const expectedIndividualVoterWeight = 500
        //     const rootDelegate = accounts[0]
        //
        //     await voteToken.generateTokens(rootDelegate, 1000)
        //     await generateTokensForAccountsAndDelegateTo(2, 4, rootDelegate, voteToken)
        //     const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
        //     await childDelegationRegistry.undelegateVote({from: accounts[2]})
        //
        //     const actualRootDelegateWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)
        //     const actualIndividualVoterWeight = await childDelegationRegistry.voteWeightOfAddress(accounts[2], voteToken.address)
        //
        //     assert.equal(actualRootDelegateWeight.toNumber(), expectedRootDelegateWeight, "Root delegate weight is not as expected")
        //     assert.equal(actualIndividualVoterWeight, expectedIndividualVoterWeight, "Individual voter weight is not as expected")
        // })
        //
        // it("calculates correct weight in child registry with 2 delegate voters after 1 voter changes delegation", async () => {
        //     const expectedRootDelegateWeight = 1500
        //     const expectedIndividualVoterWeight = 500
        //     const rootDelegate = accounts[0]
        //     const alternativeDelegate = accounts[1]
        //
        //     await voteToken.generateTokens(rootDelegate, 1000)
        //     await generateTokensForAccountsAndDelegateTo(2, 4, rootDelegate, voteToken)
        //     const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
        //     await childDelegationRegistry.delegateVote(alternativeDelegate, {from: accounts[2]})
        //
        //     const actualRootDelegateWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)
        //     const actualIndividualVoterWeight = await childDelegationRegistry.voteWeightOfAddress(accounts[2], voteToken.address)
        //
        //     assert.equal(actualRootDelegateWeight.toNumber(), expectedRootDelegateWeight, "Root delegate weight is not as expected")
        //     assert.equal(actualIndividualVoterWeight, expectedIndividualVoterWeight, "Individual voter weight is not as expected")
        // })
        //
        // it("calculates correct weight in child registry with many layers of delegation, delegated voters and undelegation", async () => {
        //     const expectedRootDelegateWeight = 1000 + 500 * 6
        //     const expectedAltDelegateWeight = 500 * 2
        //     const rootDelegate = accounts[0]
        //
        //     await voteToken.generateTokens(rootDelegate, 1000)
        //     await generateTokensForAccountsAndDelegateTo(1, 3, rootDelegate, voteToken)
        //     await generateTokensForAccountsAndDelegateTo(3, 6, accounts[1], voteToken)
        //     await generateTokensForAccountsAndDelegateTo(6, 9, accounts[2], voteToken)
        //     const childDelegationRegistry = await DelegationRegistry.new(delegationRegistry.address)
        //     // await childDelegationRegistry.undelegateVote({from: altDelegate})
        //     await childDelegationRegistry.delegateVote(accounts[3], {from: accounts[6]})
        //
        //     const actualRootDelegateWeight = await childDelegationRegistry.voteWeightOfAddress(rootDelegate, voteToken.address)
        //     const actualAltDelegateWeight = await childDelegationRegistry.voteWeightOfAddress(accounts[3], voteToken.address)
        //
        //     assert.equal(actualRootDelegateWeight.toNumber(), expectedRootDelegateWeight, "Root delegate weight is not as expected")
        //     assert.equal(actualAltDelegateWeight.toNumber(), expectedAltDelegateWeight, "Alt delegate weight is not as expected")
        // })
    })

    async function generateTokensForAccountsAndDelegateTo(fromAccount, toAccount, delegateToAccount, voteToken) {
        for (let accountNumber = fromAccount; accountNumber < toAccount; accountNumber++) {
            await voteToken.generateTokens(accounts[accountNumber], 500)
            await delegationRegistry.delegateVote(delegateToAccount, {from: accounts[accountNumber]})
        }
    }
})