var UnrevealedLockTimesLib = artifacts.require("./UnrevealedLockTimes.sol");
var Votes = artifacts.require("./Votes.sol")
var VoteToken = artifacts.require("./LockableVoteToken.sol");

module.exports = function(deployer) {
	deployer.deploy(UnrevealedLockTimesLib)
	deployer.link(UnrevealedLockTimesLib, Votes)
	deployer.deploy(Votes)
		.then(() => deployer.deploy(VoteToken, 200, Votes.address))
		.then(() => Votes.deployed())
		.then(votes => votes.setTokenAddress(VoteToken.address))
		.then(tx => console.log("Set Token Address on Votes contract: " + tx.tx))
}
