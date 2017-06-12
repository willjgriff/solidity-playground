var Vote = artifacts.require("./Vote.sol");
var VoteToken = artifacts.require("./VoteToken.sol");

module.exports = function(deployer) {
	deployer.deploy(Vote);
	deployer.deploy(VoteToken);
};
