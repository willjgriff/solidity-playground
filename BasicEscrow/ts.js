
var Utils = require("./Utils/Web3Utils.js")
var Escrow = artifacts.require("./Escrow.sol")
var escrow = Escrow.deployed()
var contractAddress = '0x60a234dd92c027c2552bb866964406018c357f33'

var arbiter = web3.eth.accounts[0]
var sender = web3.eth.accounts[1]
var receiver = web3.eth.accounts[2]

// BASIC DETAILS
// escrow
// 	.then((cont) => {
// 		console.log("Contract address: " + cont.address);
// 		console.log("Contract balance: " + Utils.balance(cont.address));
// 	})
// escrow
// 	.then((cont) => { return cont.arbiter.call() })
// 	.then((arbiter) => { console.log("Arbiter: " + arbiter) })
// escrow
// 	.then((cont) => { return cont.sender.call() })
// 	.then((arbiter) => { console.log("Sender: " + arbiter) })
// escrow
// 	.then((cont) => { return cont.receiver.call() })
// 	.then((arbiter) => { console.log("Receiver: " + arbiter) })

// LOCK PAYMENT
// escrow
// 	.then((cont) => { return cont.lockPayment(
// 		{ value: Utils.etherToWei(1), from: sender, gasPrice: Utils.gweiToWei(20), gas: 50000 }) })
// 	.then((tx) => { console.log("Contract balance after send: " + Utils.balance(contractAddress)) })

// RELEASE PAYMENT
// escrow
// 	.then((cont) => { return cont.releasePayment(
// 		{ from: sender, gasPrice: Utils.gweiToWei(20), gas: 100000 }) })
// 	.then((tx) => { console.log("Receiver Balance: " + Utils.balance(receiver))})

// RETURN PAYMENT
// escrow
// 	.then((cont) => { return cont.returnPayment({from: arbiter}) })
// 	.then((tx) => { console.log("Sender Balance: " + Utils.balance(sender))})

module.exports = (callback) => {}