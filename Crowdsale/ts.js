"use strict"

var Crowdsale = artifacts.require("./Crowdsale.sol");
var crowdsale = Crowdsale.deployed();

crowdsale
	.then(instance => instance.campaignEnd.call())
	.then(campaignEnd => console.log(new Date(campaignEnd.toNumber() * 1000)))

module.exports = (callback) => {}