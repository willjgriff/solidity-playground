const Reentrance = artifacts.require("./Reentrance.sol")
const ReenAttack = artifacts.require("./ReentranceAttack.sol")

module.exports = function(deployer) {
  // deployer.deploy(Reentrance)
  //     .then(() => deployer.deploy(ReenAttack, Reentrance.address))
}
