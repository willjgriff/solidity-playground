const DelegationTree = artifacts.require("DelegationTree.sol")
const VoteToken = artifacts.require("VoteToken.sol")
const { assertRevert } = require("./helpers/assertThrow")

contract("DelegationTree", accounts => {

    let delegationTree
    const delegateFrom = accounts[0]
    const delegateTo = accounts[1]

    beforeEach(async () => {
        delegationTree = await DelegationTree.new()
    })

    describe("delegateVote", () => {

        it("sets delegateTo address of sender to specified address", async () => {
            await delegationTree.delegateVote(delegateTo)

            const delegatedVoter = await delegationTree.delegateVoters(delegateFrom)
            assert.equal(delegatedVoter.delegateTo, delegateTo)
        })

        it("adds to delegateFrom list of delegateTo", async () => {
            const expectedVotersList = [delegateFrom];

            await delegationTree.delegateVote(delegateTo)

            const delegatedVotersList = await delegationTree.getDelegatedFromVotersForAddress(delegateTo)
            assert.deepEqual(delegatedVotersList, expectedVotersList)
        })

        it("prevents circular delegation to self", async () => {
            await assertRevert(async () => await delegationTree.delegateVote(delegateFrom))
        })

        it("prevents circular delegation with many voters", async () => {
            await createDelegations([[0, 1], [1, 2], [2, 3]])

            await assertRevert(async () => await delegationTree.delegateVote(accounts[0], {from: accounts[3]}))
        })
    })

    describe("undelegateVote", () => {

        it("")
    })

    describe("voteWeightOfAddress", () => {

        let voteToken

        beforeEach(async () => {
            voteToken = await VoteToken.new({ from: accounts[9] })
        })

        it("calculates correct weight when delegation tree is a single address", async () => {
            const expectedWeight = 1
            await distributeTokens(1)

            const actualWeight = await delegationTree.voteWeightOfAddress(accounts[0], voteToken.address)

            assert.equal(actualWeight.toNumber(), expectedWeight)
        })

        const delegationTreeTestCases = [
            new DelegationTreeTestCase(2, [[0, 1]], 1, 3), // Single delegation in tree, 1 level deep
            new DelegationTreeTestCase(4, [[0, 3], [1, 3], [2, 3]], 3, 10), // Many addresses delegating to the same address, 1 level deep
            new DelegationTreeTestCase(3, [[0, 1], [1, 2]], 2, 6), // Single addresses delegating, 2 levels deep
            new DelegationTreeTestCase(9, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]], 8, 45), // Single addresses delegating, 8 levels deep
            new DelegationTreeTestCase(9, [[0, 3], [1, 3], [2, 3], [3, 6], [4, 6], [5, 6], [6, 8], [7, 8]], 8, 45) // Many addresses delegating to many addresses, 3 levels deep
        ]

        function DelegationTreeTestCase(numberOfAccounts, delegationsList, rootDelegate, expectedWeight) {
            this.numberOfAccounts = numberOfAccounts
            this.delegationsList = delegationsList
            this.rootDelegate = rootDelegate
            this.expectedWeight = expectedWeight
        }

        function delegationTreeTest(testCase) {
            it("calculates correct weight for delegations " + testCase.delegationsList, async () => {
                await distributeTokens(testCase.numberOfAccounts)
                await createDelegations(testCase.delegationsList)

                const actualWeight = await delegationTree.voteWeightOfAddress(accounts[testCase.rootDelegate], voteToken.address)

                assert.equal(actualWeight.toNumber(), testCase.expectedWeight)
            })
        }

        delegationTreeTestCases.forEach(testCase => delegationTreeTest(testCase))

        // Use RxJs for these...
        distributeTokens = async numberOfAccounts => {
            Array.from(new Array(numberOfAccounts).keys())
                .forEach(async i => await voteToken.transfer(accounts[i], i + 1, { from: accounts[9] }))
        }
    })

    createDelegations = async delegationsList => {
        delegationsList
            .map(tuple => new Delegation(tuple[0], tuple[1]))
            .map(delegation => {
                delegation.delegateFrom = accounts[delegation.delegateFrom]
                delegation.delegateTo = accounts[delegation.delegateTo]
                return delegation
            })
            .forEach(async delegation => {
                await delegationTree.delegateVote(delegation.delegateTo, { from: delegation.delegateFrom })
            })
    }

    function Delegation(delegateFrom, delegateTo) {
        this.delegateFrom = delegateFrom
        this.delegateTo = delegateTo
    }


})