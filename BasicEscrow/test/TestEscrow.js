"use strict";
// Tests that can't seem to be done from a Solidity Test contract, mainly because the test 
// contract can't easily sign a transaction from an address other than it's own.

var Utils = require("./../Utils/TestUtils.js");
var Web3Utils = require("./../Utils/Web3Utils.js");
var Escrow = artifacts.require("./Escrow.sol");
var BigNumber = require("bignumber.js");

contract("Escrow", (accounts) => {

	var escrow;
	const paymentValue = 1000;
	const gasPrice = 20000000000;
	const gasLimit = 500000;
	var arbiterAddress = accounts[0];
	var senderAddress = accounts[1];
	var receiverAddress = accounts[2];

	// Recreate the contract before each test, closer to Unit testing this way.
	beforeEach(() => {
		return Escrow.new(senderAddress, receiverAddress, { from: arbiterAddress })
			.then((instance) => { escrow = instance });
	});

	describe('lockPayment', () => {

		it("should throw when payment is sent from an address other than the specified sender", () => {
			return Utils.assertThrows(() => { 
				return escrow.lockPayment({ from: arbiterAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit }) }, 
					gasLimit);
		});

		it("should receive payment from the sender address", () => {
			return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
				.then((tx) => {
					var contractBalance = web3.eth.getBalance(escrow.address);
					assert.equal(contractBalance.toNumber(), paymentValue, "contract value is not equal to the payment made") 
				});
		});
	})

	describe('releasePayment', () => {

		it("should throw when called from an address other than the sender or arbiter", () => {
			return Utils.assertThrows(() => { 
				return escrow.releasePayment({ from: receiverAddress, gasPrice: gasPrice, gas: gasLimit }) }, gasLimit);
		});

		it("should send the receiver the contract balance when requested by the sender", () => {
			var receiverOriginalBalance = web3.eth.getBalance(receiverAddress);

			return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
				.then((tx) => { return escrow.releasePayment({ from: senderAddress, gasPrice: gasPrice, gas: gasLimit }) })
				.then((tx) => { 
					var receiverNewBalance = web3.eth.getBalance(receiverAddress).toString();
					var receiverOriginalPlusPayment = receiverOriginalBalance.plus(paymentValue).toString();
					assert.equal(receiverNewBalance, receiverOriginalPlusPayment, "Receivers balance is incorrect") 
				});
		});

		it("should send the receiver the contract balance when requested by the arbiter", () => {
			var receiverOriginalBalance = web3.eth.getBalance(receiverAddress);

			return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
				.then((tx) => { return escrow.releasePayment({ from: arbiterAddress, gasPrice: gasPrice, gas: gasLimit }); })
				.then((tx) => { 
					var receiverNewBalance = web3.eth.getBalance(receiverAddress).toString();
					var receiverOriginalPlusPayment = receiverOriginalBalance.plus(paymentValue).toString();
					assert.equal(receiverNewBalance, receiverOriginalPlusPayment, "Receivers balance is incorrect") 
				});
		});
	})

	describe("returnPayment", () => {

		it("should throw when called from an address other than the arbiter", () => {
			return Utils.assertThrows(() => {
				return escrow.returnPayment({ from: senderAddress, gasPrice: gasPrice, gas: gasLimit } )}, gasLimit)
		});

		it("should return contract balance to sender when called by arbiter", () => {
			var originalSenderBalance = web3.eth.getBalance(senderAddress);
			var originalSenderBalanceMinusGas;

			return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
				.then((tx) => { 
					var gasPriceBigNumber = new BigNumber(gasPrice);
					var gasCost = gasPriceBigNumber.times(tx.receipt.gasUsed);
					originalSenderBalanceMinusGas = originalSenderBalance.minus(gasCost);
					return escrow.returnPayment({ from: arbiterAddress, gasPrice: gasPrice, gas: gasLimit }) })
				.then((tx) => { 
					var senderNewBalance = web3.eth.getBalance(senderAddress).toString();
					assert.equal(senderNewBalance, originalSenderBalanceMinusGas.toString(), "Senders balance is incorrect");
				});
		});
	})

});