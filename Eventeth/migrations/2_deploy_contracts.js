var UnrevealedLockTimesLib = artifacts.require("./UnrevealedLockTimes.sol");
var Votes = artifacts.require("./Votes.sol")
var VoteToken = artifacts.require("./LockableVoteToken.sol");
var VoteReward = artifacts.require("./VoteReward.sol");

// var UnrevealedTest = artifacts.require("./UnrevealedTest.sol");
var FeeVote = artifacts.require("./FeeVote.sol");
var StandardVoteToken = artifacts.require("./StandardVoteToken.sol");

module.exports = function(deployer) {
	// deployer.deploy(UnrevealedLockTimesLib)
	// deployer.link(UnrevealedLockTimesLib, Votes)
	// deployer.deploy(Votes)
	// 	.then(() => deployer.deploy(VoteToken, 200, Votes.address))
	// 	.then(() => Votes.deployed())
	// 	.then(votes => votes.setTokenAddress(VoteToken.address))
	// 	.then(tx => console.log("Set Token Address on Votes contract: " + tx.tx))

	// FOR TESTING UNREVEALED LINKED LIST
	// deployer.link(UnrevealedLockTimesLib, UnrevealedTest)
	// deployer.deploy(UnrevealedTest)

	// FOR TESTING FEE VOTE
	deployer.deploy(VoteReward)
	deployer.link(VoteReward, FeeVote)
	deployer.deploy(StandardVoteToken, 1000)
		.then(() => deployer.deploy(FeeVote, StandardVoteToken.address, "NALA", 30, 600))
		.then(() => StandardVoteToken.at(StandardVoteToken.address).approve(FeeVote.address, 100))
		.then(() => FeeVote.at(FeeVote.address).payFee())
}
