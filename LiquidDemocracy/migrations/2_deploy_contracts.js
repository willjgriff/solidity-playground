const ArrayLib = artifacts.require("./ArrayLib.sol")
const LiquidVote = artifacts.require("./LiquidVote.sol")

module.exports = function(deployer) {
    deployer.deploy(ArrayLib)
    // deployer.link(ArrayLib, LiquidVote)
    // deployer.deploy(LiquidVote)
}
