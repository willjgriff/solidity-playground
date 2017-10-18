const LinkedList = artifacts.require("./LinkedList.sol")
const LiquidVote = artifacts.require("./LiquidVote.sol")

module.exports = function(deployer) {
    deployer.deploy(LinkedList)
    // deployer.link(LinkedList, LiquidVote)
    // deployer.deploy(LiquidVote)
}
