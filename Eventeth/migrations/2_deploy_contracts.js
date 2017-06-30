var Votes = artifacts.require("./Votes.sol")
var VoteToken = artifacts.require("./LockableVoteToken.sol")

var UnrevealedLockTimesLib = artifacts.require("./UnrevealedLockTimes.sol")
var FeeVoteLib = artifacts.require("./FeeVote.sol")

// FOR TESTING CONTRACTS, AUTOMATED OR MANUAL
// var UnrevealedLockTimesTest = artifacts.require("./UnrevealedLockTimesTest.sol")
// var FeeVoteTest = artifacts.require("./FeeVoteTest.sol")
// var StandardVoteToken = artifacts.require("./StandardVoteToken.sol")
// var VoteRewardLib = artifacts.require("./VoteReward.sol")

module.exports = function(deployer) {
	// FOR FULL DEPLOYMENT
	deployer.deploy(FeeVoteLib)
	deployer.deploy(UnrevealedLockTimesLib)
	deployer.link(FeeVoteLib, Votes)
	deployer.link(UnrevealedLockTimesLib, Votes)
	deployer.deploy(Votes)
		.then(() => deployer.deploy(VoteToken, 2000, Votes.address))
		.then(() => Votes.deployed())
		.then(votes => votes.setTokenAddress(VoteToken.address))
		.then(tx => console.log("Set Token Address on Votes contract: " + tx.tx))

	// FOR TESTING UNREVEALED LOCK TIMES LINKED LIST
	// deployer.deploy(UnrevealedLockTimesLib)
	// deployer.link(UnrevealedLockTimesLib, UnrevealedLockTimesTest)
	// deployer.deploy(UnrevealedLockTimesTest)

	// FOR TESTING FEE VOTE LIBRARY - use exec fvt.js to go through basic vote tx's. Requires commenting
	// out require statements in FeeVote.sol which restrict calling of functions by time.
	// deployer.deploy(VoteRewardLib)
	// deployer.deploy(FeeVoteLib)
	// deployer.link(FeeVoteLib, FeeVoteTest)
	// deployer.link(VoteRewardLib, FeeVoteTest)
	// deployer.deploy(StandardVoteToken, 1000)
	// 	.then(() => deployer.deploy(FeeVoteTest))
	// 	.then(() => StandardVoteToken.at(StandardVoteToken.address).approve(FeeVoteTest.address, 100))
	// 	.then(() => FeeVoteTest.at(FeeVoteTest.address).initialise(StandardVoteToken.address))
}
