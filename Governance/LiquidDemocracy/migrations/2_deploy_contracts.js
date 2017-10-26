const ArrayLib = artifacts.require("./ArrayLib.sol")
const LinkedList = artifacts.require("./LinkedList.sol")
const LiquidVote = artifacts.require("./LiquidVote.sol")

module.exports = function(deployer) {
    deployer.deploy(ArrayLib)
    deployer.deploy(LinkedList)
    // deployer.link(ArrayLib, LiquidVote)
    // deployer.deploy(LiquidVote)
}
