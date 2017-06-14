var VoteToken = artifacts.require("./VoteToken.sol")
var FutarchyVote = artifacts.require("./FutarchyVote.sol")

module.exports = function(deployer) {

	var voteDuration = 60 * 3 // 3 minutes in seconds
	var testPeriodDuration = 60 * 3 // 3 minutes in seconds (more like a year in reality)

	deployer.deploy(VoteToken, 1000)
		.then(() => deployer.deploy(FutarchyVote, VoteToken.address, testPeriodDuration))
};
