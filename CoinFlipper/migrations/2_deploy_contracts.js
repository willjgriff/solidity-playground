var CoinFlipper = artifacts.require("CoinFlipper.sol");

module.exports = function(deployer) {
  deployer.deploy(CoinFlipper);
};
