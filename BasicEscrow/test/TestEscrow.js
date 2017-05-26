
// Tests that can't seem to be done from a Solidity Test contract, mainly because the test 
// contract can't easily sign a transaction from an address other than it's own.

var Utils = require("./../Utils/TestUtils.js");
var Escrow = artifacts.require("./Escrow.sol");

contract("Escrow", () => {

	var escrow;
	var senderAddress = web3.eth.accounts[1];
	var receiverAddress = web3.eth.accounts[2];

	// To recreate the contract before each test, closer to Unit testing this way.
	beforeEach(() => {
		return Escrow.new(senderAddress, receiverAddress)
			.then((instance) => { escrow = instance });
	});

	it("lockPayment should throw when payment is sent from an address other than the specified sender", () => {
		Utils.assertThrows(() => { 
			return escrow.lockPayment({ from: web3.eth.accounts[0], value: 1000, gasPrice: 20000000000, gas: 500000 }) }, 
				500000);
	});

	it("lockPayment should receive payment from the sender address", () => {
		var paymentValue = 1000;
		return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: 20000000000, gas: 500000 })
			.then((tx) => {
				var contractBalance = web3.eth.getBalance(escrow.address);
				assert.equal(contractBalance.toNumber(), paymentValue, "contract value is not equal to the payment made") 
			});
	});

	it("releasePayment should throw when called from an address other than the sender or arbiter", () => {
		Utils.assertThrows(() => { 
			return escrow.releasePayment({ from: receiverAddress, gasPrice: 20000000000, gas: 500000 }) }, 
				500000);
	});

	it("releasePayment should send the receiver the contract balance when requested by the sender", () => {
		var paymentValue = 1000;
		var receiverOriginalBalance = web3.eth.getBalance(receiverAddress).toNumber();

		return escrow.lockPayment({ from: senderAddress, value: paymentValue, gasPrice: 20000000000, gas: 500000 })
			.then((tx) => { escrow.releasePayment({ from: senderAddress, gasPrice: 20000000000, gas: 500000 }) })
			.then((tx) => { 
				var receiverNewBalance = web3.eth.getBalance(receiverAddress).toNumber();
				assert.equal(receiverNewBalance, receiverOriginalBalance + paymentValue, "Receivers balance is incorrect") 
			})
	})

});