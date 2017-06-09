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

// LISTEN TO EVENT. Filtered by account 2. Stops listening after first callback. Note that events
// fired in the current block will be fired as soon as .watch() is called on them, even if .watch()
// happens after the event is fired but before a new block is mined. Probably useful for testing.
var currentBlockNumber = web3.eth.getBlock('latest').number
var event = crowdsaleAt.Contributed({ sender: web3.eth.accounts[2] })
event.watch((error, response) => {
	if (!error) {
		console.log("Sender: " + response.args.sender + "\nAmount: " + web3.fromWei(response.args.amount, 'ether'))
	} else {
		console.log(error)
	}
	event.stopWatching()
})

// MAKE CONTRIBUTION
// crowdsale
// 	.then(instance => instance.contribute({from: web3.eth.accounts[2], value: web3.toWei(0.01, 'ether')}))
// 	.then(tx => console.log("Tx Hash: " + tx.tx))

// DELETE CONTRACT
// crowdsale
// 	.then(instance => instance.deleteContract({ from: web3.eth.coinbase }))
// 	.then(tx => console.log("Contract balance: " + web3.eth.getBalance(Crowdsale.address)))

module.exports = (callback) => {}