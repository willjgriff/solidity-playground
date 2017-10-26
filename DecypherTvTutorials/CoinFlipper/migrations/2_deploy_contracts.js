var BlockDecidingCoinFlipper = artifacts.require("BlockDecidingCoinFlipper.sol");
var OracleDecidingCoinFlipper = artifacts.require("OracleDecidingCoinFlipper.sol");

module.exports = (deployer) => {
	// gas defined are rough estimates
	deployer.deploy(BlockDecidingCoinFlipper, { gas: 300000 });
	deployer.deploy(OracleDecidingCoinFlipper, { gas: 1000000 });
};
