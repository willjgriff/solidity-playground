var YouTubeToken = artifacts.require("./YouTubeToken.sol")

module.exports = function(deployer) {
  deployer.deploy(YouTubeToken)
}
