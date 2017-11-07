const Reentrance = artifacts.require("./Reentrance.sol")
const ReenAttack = artifacts.require("./ReenAttack.sol")

module.exports = function(deployer) {
  deployer.deploy(Reentrance);
  deployer.deploy(ReenAttack);
};
