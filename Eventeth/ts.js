var FeeVote = artifacts.require("./FeeVote.sol")
var StandardVoteToken = artifacts.require("./StandardVoteToken.sol")

var feeVote = FeeVote.at(FeeVote.address)
var token = StandardVoteToken.at(StandardVoteToken.address)

var salt = 123;

// ACCOUNT BALANCES
var balance = (account) => token.balanceOf(web3.eth.accounts[account])
	.then(balance => console.log("Acc" + account + " balance: " + balance))

balance(0);
balance(1);

// TRANSFER ACC1 SOME TOKENS
// token.transfer(web3.eth.accounts[1], 300, { from: web3.eth.accounts[0] })
// 	.then(tx => console.log(tx.tx))

// // CAST VOTES
// feeVote.getSealedVote(web3.eth.accounts[0], 0, salt)
// 	.then(sealedVote => feeVote.castVote(sealedVote)
// 		.then(tx => console.log("Sealed vote cast acc0: " + sealedVote)))

// feeVote.getSealedVote(web3.eth.accounts[1], 1, salt)
// 	.then(sealedVote => feeVote.castVote(sealedVote, { from: web3.eth.accounts[1] })
// 		.then(tx => console.log("Sealed vote cast acc1: " + sealedVote)))

// REVEAL VOTES
// feeVote.revealVote(0, salt)
// 	.then(tx => console.log("Vote revealed for acc0"))

// feeVote.revealVote(1, salt, { from: web3.eth.accounts[1] })
// 	.then(tx => console.log("Vote revealed for acc1"))

// WINNING VOTE
// feeVote.winningVote().then(vote => console.log(vote == 0 ? "FOR" : "AGAINST"))

// DEBUG EVENT
var event = feeVote.Debug();
event.watch((error, response) => {
	if (!error) {
		console.log("DEBUG: " + response.args.number + " " + response.args.numero)
	} else {
		console.log(error)
	}
	event.stopWatching()
})

// CLAIM REWARDS
feeVote.claimReward().then(tx => balance(0))
feeVote.claimReward({ from: web3.eth.accounts[1] }).then(tx => balance(1))

module.exports = (callback) => {}