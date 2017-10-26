# Governance

Governance and voting contracts.

### LiquidDemocracy (WIP)
Attempt at implementing LiquidDemocracy, includes tests. Note that all the contracts and tests here are unfinished and require function docs and refactoring to increase readability. Currently stumbled at the point where I'm trying to copy the DelegateRegistry for new votes.

### LiquidLockableVote
Multi-period set of financially incentivised voting contracts with vote-reveal-claim periods. Including an ERC20 lockable vote token which is locked during the reveal period for accounts that have voted until the account reveals their vote. Multiple votes with the same end times can be created and votes cast will lock the vote token accordingly for those accounts. It includes a basic LinkedList and use of libraries. This is a variation of a voting contract inspired by: https://blog.colony.io/towards-better-ethereum-voting-protocols-7e54cb5a0119. It can be tested by executing fvt.js and un/commenting parts of the script. 

### Futarchy
Not really Futarchy but similar idea, maybe SchellingVote would be a better name. A vote contract which accepts ERC20 VoteTokens representing votes for or against a decision. The winning vote is put into practice and after a period of time the success of the decision is registered with the contract. People who previously contributed VoteToken's to the correct outcome can claim them back plus VoteTokens contributed to vote for the incorrect outcome proportional to their contribution. There is a 'ts.js' which can be used to test. To test, once contracts are deployed, start by transferring VoteTokens to a couple of accounts, then submitting votes, then if using testrpc a new block needs to be mined to update the 'now' constant in the contract (make a tx or something), then the test period outcome can be registered and winning participants can retrieve their VoteTokens.

### Voting
Basic Voting contract. It is not anonymous and the current vote tally can be observed at any time. I believe these problems can be fixed with zk-SNARKs but I don't understand them yet. There's no 'ts.js' as I tested in straight from the terminal.
