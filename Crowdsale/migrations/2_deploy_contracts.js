var Crowdsale = artifacts.require("./Crowdsale.sol")

const web3 = new (require('web3'))()

module.exports = function(deployer) {
	var campaignDuration = 60 * 90
	var campaignTarget = web3.toWei(3, 'ether')
	deployer.deploy(Crowdsale, campaignTarget, campaignDuration)
};
