const ArrayLib = artifacts.require("./ArrayLib.sol")
const LinkedList = artifacts.require("./LinkedList.sol")
const LiquidVote = artifacts.require("./LiquidVote.sol")

module.exports = async (deployer) => {
    await deployer.deploy(ArrayLib)
    await deployer.deploy(LinkedList)
    // deployer.link(ArrayLib, LiquidVote)
    // deployer.deploy(LiquidVote)
}
