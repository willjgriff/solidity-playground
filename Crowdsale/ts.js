"use strict"

var Crowdsale = artifacts.require("./Crowdsale.sol")
var crowdsale = Crowdsale.deployed()
var crowdsaleAt = Crowdsale.at(Crowdsale.address)
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

// CAMPAIGN END TIME
// crowdsale
// 	.then(instance => instance.campaignEnd.call())
// 	.then(campaignEnd => console.log(new Date(campaignEnd.toNumber() * 1000)))

// LISTEN TO EVENT, PROBABLY ONLY CALL THIS ONCE. FILTERED BY ACCOUNT 2.
// var currentBlockNumber = web3.eth.getBlock('latest').number
// var event = crowdsaleAt.Contributed({ sender: web3.eth.accounts[2] }, { fromBlock: currentBlockNumber, toBlock: 'latest' }, (error, response) => {
// 	if (!error) {
// 		console.log("Sender: " + response.args.sender + "\nAmount: " + web3.fromWei(response.args.amount, 'ether'))
// 	} else {
// 		console.log(error)
// 	}
// })

// MAKE CONTRIBUTION
crowdsale
	.then(instance => instance.contribute({from: web3.eth.accounts[2], value: web3.toWei(2, 'ether')}))
	.then(tx => console.log("Tx Hash: " + tx.tx))

module.exports = (callback) => {}