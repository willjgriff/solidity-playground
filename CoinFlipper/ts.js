"use strict";

var Utils = require("./Utils/Web3Utils.js");
var CoinFlipper = artifacts.require("./CoinFlipper.sol");
var coinFlipper = CoinFlipper.deployed();
var contractAddress = "0xbbe00905936b2795835a58f07c75cfd47b167903";

var creator = web3.eth.accounts[0];
var wagerCreator = web3.eth.accounts[1];
var wagerAccepter = web3.eth.accounts[2];
const gasPrice = 20000000000;
const gasLimit = 500000;

// CURRENT STATE
coinFlipper
	.then((instance) => { return instance.state.call() })
	.then((currentState) => { 
		console.log("Contract state (0-noWager, 1-wagerMade, 2-wagerAccepted): " + currentState.toString()
			+ "\nContract balance, ether: " + Utils.balance(contractAddress)) });

// MAKE WAGER
// coinFlipper
// 	.then((instance) => { return instance.makeWager(
// 		{ from: wagerCreator, value: Utils.etherToWei(1), gasPrice: gasPrice, gas: gasLimit }) })
// 	.then((tx) => { console.log("Contract balance: " + Utils.balance(contractAddress)); });

// ACCEPT WAGER
// coinFlipper
// 	.then((instance) => { return instance.acceptWager(
// 		{ from: wagerAccepter, value: Utils.etherToWei(1), gasPrice: gasPrice, gas: gasLimit }) })
// 	.then((tx) => { "Contract balance: " + Utils.balance(contractAddress) });

// DECIDE WAGER
coinFlipper
	.then((instance) => { return instance.decideWager({ gasPrice: gasPrice, gas: gasLimit }) })
	.then((tx) => { 
		console.log("Contract balance: " + Utils.balance(contractAddress));
		console.log("Wager creator balance: " + Utils.balance(wagerCreator));
		console.log("Wager accepter balance: " + Utils.balance(wagerAccepter));
	});

module.exports = (callback) => {}