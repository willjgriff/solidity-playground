pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Escrow.sol";

contract TestEscrow {

	Escrow escrow;
	uint public initialBalance = 1000 wei;
	address constant sender = 0xF1B86108ed80B4c376eeC633506a8f2d8599C3a7;
	address constant receiver = 0x428F70ED3F1c2Ac7f5C811Fd1bc6F2b38f14c8BA;

	function beforeEach() {
		escrow = new Escrow(sender, receiver);
	}

	function testArbiterAddressIsTheContractCreator() {
		address expectedArbiter = this;
		Assert.equal(escrow.arbiter(), expectedArbiter, "Arbiter should be the address creator");
	}

	function testSenderAddressIsCorrectlySet() {
		Assert.equal(escrow.sender(), sender, "Sender should be the first argument from the contract's constructor");
	}

	function testReceiverAddressIsCorrectlySet() {
		Assert.equal(escrow.receiver(), receiver, "Receiver should be the second argument from the contract's constructor");
	}

	function testLockPaymentThrowsWhenCalledFromNonSenderAddress() {
		// Necessary to call raw function to prevent error thrown 'bubbling up' to this contract.
		bool lockThrowsError = escrow.call(bytes4(bytes32(sha3("lockPayment()"))));
		Assert.isFalse(lockThrowsError, "Escrow lockPayment should throw an error if called from non-sender address");
	}

	function testTransferThrowsWhenCalledFromNonSenderAddress() {
		bool sendThrowsError = escrow.send(1000);
		Assert.isFalse(sendThrowsError, "Escrow send should throw an error if funds sent from non-sender address");
		Assert.equal(escrow.balance, 0, "Escrow should not receive funds from address other than sender");
	}
}
