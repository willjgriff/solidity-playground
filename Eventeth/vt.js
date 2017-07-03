var Votes = artifacts.require("./Votes.sol")
var LockableVoteToken = artifacts.require("./LockableVoteToken.sol")

var votes = Votes.at(Votes.address)
var voteToken = LockableVoteToken.at(LockableVoteToken.address)

var salt = "123"

// Make a function for this.
var voteCreatedEvent = votes.VoteCreated()
voteCreatedEvent.watch((error, response) => {
	if (!error) {
		console.log("Vote Created - ID: " + response.args.voteId + " Desc: " + response.args.voteDescription)
	} else {
		console.log(error)
	}
	voteCreatedEvent.stopWatching()
})

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

var castVote = (account, voteDecision, voteId, previousLockTime) => 
	votes.getSealedVote(web3.eth.accounts[account], voteDecision, salt)
		.then(sealedVote => votes.castVote(voteId, sealedVote, previousLockTime, { from: web3.eth.accounts[account] })
			.then(tx => console.log("Sealed vote cast by acc" + account)))

var revealVote = (fromAccount, voteId, voteDecision, salt) =>
	votes.revealVote(voteId, voteDecision, salt, { from: web3.eth.accounts[fromAccount] })
		.then(() => console.log("Vote revealed by acc" + fromAccount))

var earliestLockTime = (account) => votes.voterEarliestTokenLockTime(web3.eth.accounts[account])
	.then(lockTime =>  console.log("Current earliest locktime for voter acc" + account + ": " + lockTime))

var now = () => votes.blockTimeNow()
	.then(now => console.log("Contract now: " + now.toNumber()))

var latestPrevTime = (account, voteId) => 
	votes.latestPreviousLockTime(web3.eth.accounts[account], voteId)

var latestPrevPrint = (account, voteId) => latestPrevTime(account, voteId)
		.then(latestPrevTime => console.log("Latest Previous LockTime for vote " + voteId + ": " + latestPrevTime.toNumber()))


// approveTokens(0, Votes.address, 200)
// 	.then(() => transfer(0, 1, 100))
// 	.then(() => createVote("Event 1 is fake", 1, 1))
// 	.then(() => castVote(0, 0, 1, 0))
// 	.then(() => latestPrevPrint(0, 1))

// createVote("Event 2 is fake", 1, 1)
// 	.then(() => latestPrevPrint(0, 2))
// 	.then(latestPrevTime => castVote(0, 1, 1, latestPrevTime))

// latestPrevPrint(0, 1)

votes.getUnrevealedNode(0, 1499096967)



// earliestLockTime(0)
// 	.then(() => balances())
// 	.then(() => transfer(0, 1, 20))
// 	.then(() => balances())



// revealVote(0, 1, 0, salt)
// 	.then(() => earliestLockTime(0))




module.exports = (callback) => {}