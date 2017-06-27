pragma solidity ^0.4.11;

import "./LockTimesLinkedList.sol";
import "./VoteIdsLinkedList.sol";

contract LibPlay {
    
	using LockTimesLinkedList for LockTimesLinkedList.LinkedList;
	using VoteIdsLinkedList for VoteIdsLinkedList.LinkedList;
	
	LockTimesLinkedList.LinkedList linkedList;

	function getNode(uint ind) constant external returns (uint256[3]) {
		var node = linkedList.getNode(ind);
		return [node.previousNode, node.nodeData.voteIdsCount, node.nextNode];
	}

	modifier validAscendingInsertion(uint previousNodeId, uint newNode) {
		LockTimesLinkedList.Node previousNode = linkedList.getNode(previousNodeId);
		if (previousNodeId > newNode || (previousNode.nextNode < newNode && previousNode.nextNode != 0)) throw;
		_;
	}

	function insert(uint existingPreviousNode, uint newNode) 
		validAscendingInsertion(existingPreviousNode, newNode)
		external
	{
		linkedList.insert(existingPreviousNode, newNode);
	}

	function remove(uint index) external {
		linkedList.remove(index);
	}
	
	function isNode(uint nodeId) returns (bool) {
		return linkedList.isNode(nodeId);
	}
	
	function hasVoteAtTime(uint voteTime, uint voteId) constant returns (bool) {
	    LockTimesLinkedList.NodeData storage lockTimeNodeData = linkedList.getNode(voteTime).nodeData;
	    return lockTimeNodeData.voteIds.isNode(voteId);
	}

	function insertVote(uint latestPreviousTime, uint voteTime, uint voteId) {
		if (!linkedList.isNode(voteTime)) {
			linkedList.insert(latestPreviousTime, voteTime);
		}
		
		LockTimesLinkedList.NodeData storage lockTimeNodeData = linkedList.getNode(voteTime).nodeData;
		lockTimeNodeData.voteIdsCount++;
		VoteIdsLinkedList.LinkedList storage votesLinkedList = lockTimeNodeData.voteIds;
		votesLinkedList.insert(0, voteId);
	}
	
	function removeVote(uint voteTime, uint voteId) {
	    
	}
	
}