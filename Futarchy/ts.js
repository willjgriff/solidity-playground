var FutarachyVote = artifacts.require("./FutarchyVote.sol")
var VoteToken = artifacts.require("./VoteToken.sol")

var futarachyVote = FutarachyVote.at(FutarachyVote.address)
var voteToken = VoteToken.at(VoteToken.address)

voteToken.balanceOf(web3.eth.accounts[0]).then(balance => console.log("Acc 0 balance: " + balance.toNumber()))
voteToken.balanceOf(web3.eth.accounts[1]).then(balance => console.log("Acc 1 balance: " + balance.toNumber()))



module.exports = (callback) => {}