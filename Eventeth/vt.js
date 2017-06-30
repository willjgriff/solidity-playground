var Votes = artifacts.require("./Votes.sol")
var LockableVoteToken = artifacts.require("./LockableVoteToken.sol")

var votes = Votes.at(Votes.address)
var voteToken = LockableVoteToken.at(LockableVoteToken.address)

var salt = "123"

var voteCreatedEvent = votes.VoteCreated()
voteCreatedEvent.watch((error, response) => {
	if (!error) {
		console.log("Vote Created - ID: " + response.args.voteId + " Desc: " + response.args.voteDescription)
	} else {
		console.log(error)
	}
	voteCreatedEvent.stopWatching()
})


var approveTokens = (fromAccount, spender, value) =>
	voteToken.approve(spender, value, { from: web3.eth.accounts[fromAccount] })
	.then(() => console.log("Acc" + fromAccount + " approved " + value + " for " + Votes.address))

var createVote = (voteDesc, voteTime, revealTime) => votes.createVote(voteDesc, voteTime, revealTime)
	.then(() => console.log("Vote created, see logs for ID"))

var castVote = (account, voteDecision, voteId, previousLockTime) => votes.getSealedVote(web3.eth.accounts[account], voteDecision, salt)
	.then(sealedVote => votes.castVote(voteId, sealedVote, previousLockTime, { from: web3.eth.accounts[account] })
		.then(tx => console.log("Sealed vote cast by acc" + account)))

var revealVote = (fromAccount, voteId, voteDecision, salt) =>
	votes.revealVote(voteId, voteDecision, salt, { from: web3.eth.accounts[fromAccount] })
	.then(() => console.log("Vote revealed by: " + fromAccount))


approveTokens(0, Votes.address, 100)
	.then(() => createVote("Event with ID: blah blah is fake", 60, 60))
	.then(() => castVote(0, 0, 0, 0))
	// .then(() => )

module.exports = (callback) => {}