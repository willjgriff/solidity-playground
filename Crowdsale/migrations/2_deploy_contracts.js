var Crowdsale = artifacts.require("./Crowdsale.sol");

const web3 = new (require('web3'))();

module.exports = function(deployer) {
	var campaignDuration = 60 * 90;
	deployer.deploy(Crowdsale, web3.toWei(3, 'ether'), 0);
};
