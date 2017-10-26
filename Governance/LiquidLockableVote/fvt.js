var FeeVoteTest = artifacts.require("./FeeVoteTest.sol")
var StandardVoteToken = artifacts.require("./StandardVoteToken.sol")

var feeVoteTest = FeeVoteTest.at(FeeVoteTest.address)
var token = StandardVoteToken.at(StandardVoteToken.address)

var salt = 123;

// ACCOUNT BALANCES
var balance = (account) => token.balanceOf(web3.eth.accounts[account])
	.then(balance => console.log("Acc" + account + " balance: " + balance))

var balances = () => {
	balance(0)
	balance(1)
	balance(2)
	balance(3)
	token.balanceOf(FeeVoteTest.address)
		.then(balance => console.log("FeeVoteTest balance: " + balance))
}

var transfer = (fromAccount, toAccount, value) => token.transfer(web3.eth.accounts[toAccount], value, { from: web3.eth.accounts[fromAccount] })
	.then(tx => console.log(value + " transfered from " + fromAccount + " to " + toAccount))

var castVote = (account, vote) => feeVoteTest.getSealedVote(web3.eth.accounts[account], vote, salt)
	.then(sealedVote => feeVoteTest.castVote(sealedVote, { from: web3.eth.accounts[account] })
		.then(tx => console.log("Sealed vote cast acc" + account + ": " + sealedVote)))

var revealVote = (account, vote) => feeVoteTest.revealVote(vote, salt, { from: web3.eth.accounts[account] })
	.then(tx => console.log("Vote revealed for acc" + account))

var claimReward = (account) => feeVoteTest.claimReward({ from: web3.eth.accounts[account] })
	.then(tx => console.log("Reward claimed for acc" + account))

// WINNING VOTE
// feeVoteTest.winningVote().then(vote => console.log(vote == 0 ? "FOR" : "AGAINST"))

// DEBUG EVENTS
// var debugEvent = feeVoteTest.Debug();
// debugEvent.watch((error, response) => {
// 	if (!error) {
// 		console.log("DEBUG: " + response.args.voterDecision + " " + response.args.voteContrib + " " + response.args.votesFor + " " + response.args.votesAgainst + " " + response.args.totalRe + " " + response.args.voterRewardAmount)
// 	} else {
// 		console.log(error)
// 	}
// 	debugEvent.stopWatching()
// })

// var debugEvent2 = feeVoteTest.Debug2();
// debugEvent2.watch((error, response) => {
// 	if (!error) {
// 		console.log("DEBUG2: " + response.args.voterGroupReward + " " + response.args.voterGroupContrib + " " + response.args.voterReward)
// 	} else {
// 		console.log(error)
// 	}
// 	debugEvent2.stopWatching()
// })

transfer(0, 1, 400)
	.then(() => transfer(0, 2, 200))
	.then(() => transfer(0, 3, 100))
	.then(() => castVote(0, 0))
	.then(() => castVote(1, 1))
	.then(() => castVote(2, 1))
	.then(() => castVote(3, 0))
	.then(() => revealVote(0, 0))
	.then(() => revealVote(1, 1))
	.then(() => revealVote(2, 1))
	.then(() => revealVote(3, 0))
	.then(() => claimReward(0))
	.then(() => claimReward(1))
	.then(() => claimReward(2))
	.then(() => claimReward(3))
	.then(() => balances())

module.exports = (callback) => {}