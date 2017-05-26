pragma solidity ^0.4.11;

contract Escrow {
	address public arbiter;
	address public sender;
	address public receiver;

	function Escrow(address senderArg, address receiverArg) {
	    arbiter = msg.sender;
		sender = senderArg;
		receiver = receiverArg;
	}

	function lockPayment() payable {
		if (msg.sender != sender) {
			throw;
		}
	}

	function releasePayment() {
		if (msg.sender != sender && msg.sender != arbiter) {
			throw;
		} else {
			receiver.transfer(this.balance);
		}
	}

	function returnPayment() {
		if (msg.sender != arbiter) {
			throw;
		} else {
			sender.transfer(this.balance);
		}
	}
}