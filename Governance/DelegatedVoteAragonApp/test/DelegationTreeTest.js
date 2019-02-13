const DelegationTree = artifacts.require("DelegationTree.sol")
const VoteToken = artifacts.require("VoteToken.sol")
const { assertRevert } = require("./helpers/assertThrow")
const { range, from } = require("rxjs");
const { mergeMap, map } = require("rxjs/operators")

contract("DelegationTree", accounts => {

    let delegationTree
    const delegateFrom = accounts[0]
    const delegateTo = accounts[1]

    beforeEach(async () => {
        delegationTree = await DelegationTree.new()
    })

    describe("delegateVote(address _delegateTo)", () => {

        it("sets delegateTo address of sender to specified address", async () => {
            await delegationTree.delegateVote(delegateTo)

            const delegateVoter = await delegationTree.delegateVoters(delegateFrom)
            assert.equal(delegateVoter.delegateTo, delegateTo)
        })

        it("adds to delegateFrom list of delegateTo", async () => {
            const expectedVotersList = [delegateFrom];

            await delegationTree.delegateVote(delegateTo)

            const delegateVotersList = await delegationTree.getDelegatedFromVotersForAddress(delegateTo)
            assert.deepEqual(delegateVotersList, expectedVotersList)
        })

        it("prevents circular delegation to self", async () => {
            await assertRevert(async () => await delegationTree.delegateVote(delegateFrom))
        })

        it("prevents circular delegation with many voters", async () => {
            await createDelegations$([[0, 1], [1, 2], [2, 3]]).toPromise()

            await assertRevert(async () => await delegationTree.delegateVote(accounts[0], {from: accounts[3]}))
        })
    })

    describe("undelegateVote()", () => {

        it("removes delegation of specified address and updates from voters", async () => {
            await delegationTree.delegateVote(delegateTo)
            const expectedFromVoters = []

            await delegationTree.undelegateVote()

            const fromDelegateVoter = await delegationTree.delegateVoters(delegateFrom)
            const toDelegateVoterFromVoters = await delegationTree.getDelegatedFromVotersForAddress(delegateTo)
            assert.equal(fromDelegateVoter.delegateTo, 0)
            assert.deepEqual(toDelegateVoterFromVoters, expectedFromVoters)
        })

        it("updates the moved voters from voters index", async () => {
            await createDelegations$([[0, 3], [1, 3], [2, 3]]).toPromise()

            await delegationTree.undelegateVote({ from: accounts[1] })

            const movedDelegateVoter = await delegationTree.delegateVoters(accounts[2])
            assert(movedDelegateVoter.delegatedFromAddressesIndex, 1)
        })
    })

    describe("voteWeightOfAddress(address _address, IERC20 _token)", () => {

        let voteToken
        const tokenCreator = accounts[9]

        beforeEach(async () => {
            voteToken = await VoteToken.new({ from: tokenCreator })
        })

        it("calculates correct weight when delegation tree is a single address", async () => {
            const expectedWeight = 1
            await distributeTokens$(1).toPromise()

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
                await distributeTokens$(testCase.numberOfAccounts).toPromise()
                await createDelegations$(testCase.delegationsList).toPromise()

                const actualWeight = await delegationTree.voteWeightOfAddress(accounts[testCase.rootDelegate], voteToken.address)

                assert.equal(actualWeight.toNumber(), testCase.expectedWeight)
            })
        }

        delegationTreeTestCases.forEach(testCase => delegationTreeTest(testCase))

        const distributeTokens$ = (numberOfAccounts) => range(0, numberOfAccounts).pipe(
            mergeMap(i => voteToken.transfer(accounts[i], i + 1, { from: tokenCreator }))
        )
    })

    const createDelegations$ = (delegationsList) => from(delegationsList).pipe(
        map(tuple => new Delegation(accounts[tuple[0]], accounts[tuple[1]])),
        mergeMap(delegation => delegationTree.delegateVote(delegation.delegateTo, { from: delegation.delegateFrom }))
    )

    function Delegation(delegateFrom, delegateTo) {
        this.delegateFrom = delegateFrom
        this.delegateTo = delegateTo
    }


})