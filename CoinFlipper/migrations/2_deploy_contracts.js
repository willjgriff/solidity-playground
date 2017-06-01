var BlockDecidingCoinFlipper = artifacts.require("BlockDecidingCoinFlipper.sol");
var OracleDecidingCoinFlipper = artifacts.require("OracleDecidingCoinFlipper.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockDecidingCoinFlipper, { gasPrice: 20000000000 });
  deployer.deploy(OracleDecidingCoinFlipper, { gasPrice: 20000000000 });
};
