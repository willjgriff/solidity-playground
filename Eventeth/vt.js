var Votes = artifacts.require("./Votes.sol")
var LockableVoteToken = artifacts.require("./LockableVoteToken.sol")

var votes = Votes.at(Votes.address)
var voteToken = LockableVoteToken.at(LockableVoteToken.address)

var salt = "123"

var voteCreatedEvent = votes.LogVoteCreated()
voteCreatedEvent.watch((error, response) => {
	if (!error) {
		console.log("Vote Created - ID: " + response.args.voteId + " Desc: " + response.args.voteDescription)
	} else {
		console.log(error)
	}
	// voteCreatedEvent.stopWatching()
})

var wait = (ms) => {
   var start = new Date().getTime()
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime()
  }
}

var balance = (account) => voteToken.balanceOf(web3.eth.accounts[account])
	.then(balance => console.log("Acc" + account + " balance: " + balance))

var totalBalance = (account) => voteToken.totalBalanceOf(web3.eth.accounts[account])
	.then(balance => console.log("Acc" + account + " total balance: " + balance))

var balances = () => {
	balance(0)
	balance(1)
	totalBalance(0)
	totalBalance(1)
}

var transfer = (fromAccount, toAccount, value) => voteToken.transfer(web3.eth.accounts[toAccount], value, { from: web3.eth.accounts[fromAccount] })
	.then(tx => console.log(value + " transfered from " + fromAccount + " to " + toAccount))

var approveTokens = (fromAccount, spender, value) =>
	voteToken.approve(spender, value, { from: web3.eth.accounts[fromAccount] })
		.then(() => console.log("Acc" + fromAccount + " approved " + value + " for " + Votes.address))

var createVote = (voteDesc, voteTime, revealTime) => votes.createVote(voteDesc, voteTime, revealTime)
	.then(() => console.log("Vote created, see logs for ID"))

var getSealedVote = (account, voteDecision) => votes.getSealedVote(web3.eth.accounts[account], voteDecision, salt)

var castVote = (account, voteDecision, voteId, previousLockTime) => getSealedVote(account, voteDecision)
	.then(sealedVote => votes.castVote(voteId, sealedVote, previousLockTime, { from: web3.eth.accounts[account] })
		.then(tx => console.log("Sealed vote cast by acc" + account)))

var revealVote = (fromAccount, voteId, voteDecision, salt) =>
	votes.revealVote(voteId, voteDecision, salt, { from: web3.eth.accounts[fromAccount] })
		.then(() => console.log("Vote revealed by acc" + fromAccount))

var claimReward = (account, voteId) => votes.claimReward(voteId, { from: web3.eth.accounts[account] })
	.then(() => console.log("Reward for acc" + account + " claimed for vote " + voteId))

var earliestLockTime = (account) => votes.voterEarliestTokenLockTime(web3.eth.accounts[account])
	.then(lockTime =>  console.log("Current earliest locktime for voter acc" + account + ": " + lockTime))

var latestPrevTime = (account, voteId) => 
	votes.latestPreviousLockTime(web3.eth.accounts[account], voteId)

var latestPrevPrint = (account, voteId) => latestPrevTime(account, voteId)
		.then(latestPrevTime => console.log("Latest Previous LockTime for vote " + voteId + ": " + latestPrevTime.toNumber()))


// Execute the below in order of line count after successful migration.
// Run this to create 2 votes, each voted on by acc0.
approveTokens(0, Votes.address, 200)
	.then(() => transfer(0, 1, 100))
	.then(() => createVote("Event 1 is fake", 1, 1))
	.then(() => latestPrevTime(0, 1))
	.then(latestPrevTime => castVote(0, 0, 1, latestPrevTime))

	.then(() => wait(2000))
	.then(() => createVote("Event 2 is fake", 1, 1))
	.then(() => latestPrevTime(0, 2))
	.then(latestPrevTime => castVote(0, 1, 2, latestPrevTime))


// Execute before and after revealing the vote below to test the vote token prevents / buffers transfers.
// It should throw an error when execute before the following block. 
// Note: Output of earliest lock time must be 0 or after now for transfers to execute.
// earliestLockTime(0)
// 	.then(() => balances())
// 	.then(() => transfer(1, 0, 5))
// 	.then(() => transfer(0, 1, 10))
// 	.then(() => balances())


// Reveal votes unlocking tokens and updating token balances
// revealVote(0, 1, 0, salt)
// 	.then(() => earliestLockTime(0))
// 	.then(() => revealVote(0, 2, 1, salt))
// 	.then(() => earliestLockTime(0))


// Claim rewards
// claimReward(0, 1)
// 	.then(() => balance(0))
// 	.then(() => claimReward(0, 2))
// 	.then(() => balance(0))


module.exports = (callback) => {}