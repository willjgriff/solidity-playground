var SimpleStorage = artifacts.require("./SimpleStorage.sol")
var YouTubeToken = artifacts.require("./YouTubeToken.sol")

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage)
  deployer.deploy(YouTubeToken)
}
