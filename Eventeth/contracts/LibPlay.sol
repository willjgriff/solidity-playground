pragma solidity ^0.4.11;

import "./CircularLinkedList.sol";

contract LibPlay {

	using CircularLinkedList for CircularLinkedList.LinkedList;

	CircularLinkedList.LinkedList linkedList;

	function getItem(uint ind) constant returns (uint256[3]) {
		var node = linkedList.getNode(ind);
		return [node.previousNode, node.voteId, node.nextNode];
	}

	function insertItem(uint existingPreviousNode, uint newNode) {
		linkedList.insert(existingPreviousNode, newNode);
	}

	function removeItem(uint index) {
		linkedList.remove(index);
	}
}