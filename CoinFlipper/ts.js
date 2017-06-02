"use strict";

var Utils = require("./Utils/Web3Utils.js");
// UNCOMMENT THE CONTRACT WE WANT TO PLAY WITH
// var CoinFlipper = artifacts.require("./BlockDecidingCoinFlipper.sol");
var CoinFlipper = artifacts.require("./OracleDecidingCoinFlipper.sol");
var coinFlipper = CoinFlipper.deployed();
var contractAddress = "0x716ca4cf63e2486b5a40880f64533db68cacd78d";

var creator = web3.eth.accounts[0];
var wagerCreator = web3.eth.accounts[1];
var wagerAccepter = web3.eth.accounts[2];
const gasPrice = 20000000004;
const gasLimit = 1000004;

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
// 	.then((tx) => { console.log("makeWager minder, contract balance: " + Utils.balance(contractAddress)); });

// ACCEPT WAGER
// coinFlipper
// 	.then((instance) => { return instance.acceptWager(
// 		{ from: wagerAccepter, value: Utils.etherToWei(1), gasPrice: gasPrice, gas: gasLimit }) })
// 	.then((tx) => { "acceptWager mined, contract balance: " + Utils.balance(contractAddress) });

// DECIDE WAGER BLOCK FLIPPER
// coinFlipper
// 	.then((instance) => { 
// 		console.log("Wager creator balance before: " + Utils.balance(wagerCreator));
// 		console.log("Wager accepter balance before: " + Utils.balance(wagerAccepter));
// 		return instance.decideWager({ gasPrice: gasPrice, gas: gasLimit }); })
// 	.then((tx) => { 
// 		console.log("decideWager mined, contract balance: " + Utils.balance(contractAddress));
// 		console.log("Wager creator balance after: " + Utils.balance(wagerCreator));
// 		console.log("Wager accepter balance after: " + Utils.balance(wagerAccepter));
// 	});

// DECIDE WAGER ORACLIZE FLIPPER
coinFlipper
	.then((instance) => { 
		console.log("Wager creator balance before: " + Utils.balance(wagerCreator));
		console.log("Wager accepter balance before: " + Utils.balance(wagerAccepter));
		return instance.decideWager({ gasPrice: gasPrice, gas: gasLimit }) })
	.then((tx) => { 
		console.log("decideWager mined, contract balance: " + Utils.balance(contractAddress));
		console.log("Wager creator balance after: " + Utils.balance(wagerCreator));
		console.log("Wager accepter balance after: " + Utils.balance(wagerAccepter));
	});

module.exports = (callback) => {}