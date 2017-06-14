var VoteToken = artifacts.require("./VoteToken.sol")
var FutarchyVote = artifacts.require("./FutarchyVote.sol")

module.exports = function(deployer) {

	var voteDuration = 30 // 30 seconds (probably a week or so in reality)
	var testPeriodDuration = 30 // 30 seconds (probably a year or so in reality)

	deployer.deploy(VoteToken, 1000)
		.then(() => deployer.deploy(FutarchyVote, VoteToken.address, voteDuration, testPeriodDuration))
};
