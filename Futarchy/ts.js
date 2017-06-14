var FutarchyVote = artifacts.require("./FutarchyVote.sol")
var VoteToken = artifacts.require("./VoteToken.sol")

var futarchyVote = FutarchyVote.at(FutarchyVote.address)
var voteToken = VoteToken.at(VoteToken.address)

var voteTokenBalances = () => {
	displayTokenBalance(web3.eth.accounts[0], "Acc 0 balance: ")
	displayTokenBalance(web3.eth.accounts[1], "Acc 1 balance: ")
	displayTokenBalance(web3.eth.accounts[2], "Acc 2 balance: ")
	displayTokenBalance(FutarchyVote.address, "Futarchy balance: ")
}

var displayTokenBalance = (account, displayStatment) => 
	voteToken.balanceOf(account).then(balance => console.log(displayStatment + balance.toNumber()))

var futarchyBalance = () => voteToken.balanceOf(FutarchyVote.address)
	.then(futarchyBalance => console.log("Futarchy balance: " + futarchyBalance.toNumber()))

var approveVotes = (numberOfVotes, fromAddress) => 
	voteToken.approve(FutarchyVote.address, 0, { from: fromAddress })
		.then(tx => voteToken.approve(FutarchyVote.address, numberOfVotes, { from: fromAddress }))

// BASIC DETAILS
voteTokenBalances()
futarchyVote.voteEndTime().then(time => console.log(new Date(time.toNumber() * 1000)))

// TRANSFER VOTE TOKENS TO ACCOUNT 1
// voteToken.transfer(web3.eth.accounts[1], 300)
// voteToken.transfer(web3.eth.accounts[2], 100)

// APPROVE AND COMMIT 'FOR' VOTES
// approveVotes(20, web3.eth.accounts[0])
// 	.then(tx => futarchyVote.voteFor(20))
// 	.then(tx => futarchyVote.votesFor())
// 	.then(votesFor => { 
// 		console.log("Votes for: " + votesFor)
// 		futarchyBalance()
// 	})

// APPROVE AND COMMIT 'AGAINST' VOTES
// approveVotes(30, web3.eth.accounts[1])
// 	.then(tx => futarchyVote.voteAgainst(30, { from: web3.eth.accounts[1] }))
// 	.then(tx => futarchyVote.votesAgainst())
// 	.then(votesAgainst => { 
// 		console.log("Votes against: " + votesAgainst)
// 		futarchyBalance()
// 	})

// approveVotes(15, web3.eth.accounts[2])
// 	.then(tx => futarchyVote.voteAgainst(15, { from: web3.eth.accounts[2] }))
// 	.then(tx => futarchyVote.votesAgainst())
// 	.then(votesAgainst => { 
// 		console.log("Votes against: " + votesAgainst)
// 		futarchyBalance()
// 	})

// DISPLAY WINNER
// futarchyVote.votedFor()
// 	.then(votedInFavour => console.log("Winner: " + (votedInFavour ? "for" : "against")))

// SPECIFY SUCCESS AND RETURN FUNDS
// futarchyVote.testPeriodSuccess(false)
// 	.then(tx => futarchyVote.claimReward({ from: web3.eth.accounts[0] }))
// 	.then(tx => futarchyVote.claimReward({ from: web3.eth.accounts[1] }))
// 	.then(tx => futarchyVote.claimReward({ from: web3.eth.accounts[2] }))

module.exports = (callback) => {}
