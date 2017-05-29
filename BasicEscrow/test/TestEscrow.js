
// Tests that can't seem to be done from a Solidity Test contract, mainly because the test 
// contract can't easily sign a transaction from an address other than it's own.

var Utils = require("./../Utils/TestUtils.js");
var Web3Utils = require("./../Utils/Web3Utils.js");
var Escrow = artifacts.require("./Escrow.sol");

contract("Escrow", () => {

	var escrow;
	const paymentValue = 1000;
	const gasPrice = 20000000000;
	const gasLimit = 500000;
	var arbiterAddress = web3.eth.accounts[0];
	var senderAddress = web3.eth.accounts[1];
	var receiverAddress = web3.eth.accounts[2];

	// To recreate the contract before each test, closer to Unit testing this way.
	beforeEach(() => {
		return Escrow.new(senderAddress, receiverAddress, { from: arbiterAddress })
			.then((instance) => { escrow = instance });
	});

	it("lockPayment should throw when payment is sent from an address other than the specified sender", () => {
		return Utils.assertThrows(() => { 
			return escrow.lockPayment({ from: arbiterAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit }) }, 
				gasLimit);
	});

	it("lockPayment should receive payment from the sender address", () => {
		return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
			.then((tx) => {
				var contractBalance = web3.eth.getBalance(escrow.address);
				assert.equal(contractBalance.toNumber(), paymentValue, "contract value is not equal to the payment made") 
			});
	});

	it("releasePayment should throw when called from an address other than the sender or arbiter", () => {
		return Utils.assertThrows(() => { 
			return escrow.releasePayment({ from: receiverAddress, gasPrice: gasPrice, gas: gasLimit }) }, gasLimit);
	});

// This test fails sometimes.
	it("releasePayment should send the receiver the contract balance when requested by the sender", () => {
		var receiverOriginalBalance = web3.eth.getBalance(receiverAddress).toNumber();

		return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
			.then((tx) => { return escrow.releasePayment({ from: senderAddress, gasPrice: gasPrice, gas: gasLimit }) })
			.then((tx) => { 
				var receiverNewBalance = web3.eth.getBalance(receiverAddress).toNumber();
				assert.equal(receiverNewBalance, receiverOriginalBalance + paymentValue, "Receivers balance is incorrect") 
			});
	});

// This test fails sometimes.
	it("releasePayment should send the receiver the contract balance when requested by the arbiter", () => {
		var receiverOriginalBalance = web3.eth.getBalance(receiverAddress).toNumber();

		return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
			.then((tx) => { return escrow.releasePayment({ from: arbiterAddress, gasPrice: gasPrice, gas: gasLimit }); })
			.then((tx) => { 
				var receiverNewBalance = web3.eth.getBalance(receiverAddress).toNumber();
				assert.equal(receiverNewBalance, receiverOriginalBalance + paymentValue, "Receivers balance is incorrect") 
			});
	});

	it("returnPayment should throw when called from an address other than the arbiter", () => {
		return Utils.assertThrows(() => {
			return escrow.returnPayment({ from: senderAddress, gasPrice: gasPrice, gas: gasLimit } )}, gasLimit)
	});

// This test fails sometimes.
	it("returnPayment should send contract balance to sender when called by arbiter", () => {
		var originalSenderBalance = web3.eth.getBalance(senderAddress).toNumber();

		return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: gasPrice, gas: gasLimit })
			.then((tx) => { 
				var senderDeductedBalance = Web3Utils.rawBalance(senderAddress);

				originalSenderBalance -= tx.receipt.gasUsed * gasPrice;

				console.log(originalSenderBalance);
				console.log(paymentValue);
				console.log(tx.receipt.gasUsed * gasPrice);

				// assert.equal(senderDeductedBalance, originalSenderBalance - paymentValue - tx.gas, "Senders deducted balance is incorrect");
				return escrow.returnPayment({ from: arbiterAddress, gasPrice: gasPrice, gas: gasLimit }) })
			.then((tx) => { 
				var senderNewBalance = web3.eth.getBalance(senderAddress).toNumber();
				assert.equal(senderNewBalance, originalSenderBalance, "Senders balance is incorrect");
			});
	});

});