pragma solidity ^0.4.11;

import "./LockTimesLinkedList.sol";
import "./VoteIdsLinkedList.sol";

contract LibPlay {
    
    uint constant HEAD_AND_TAIL = 0;
    
	using LockTimesLinkedList for LockTimesLinkedList.LinkedList;
	using VoteIdsLinkedList for VoteIdsLinkedList.LinkedList;
	
	LockTimesLinkedList.LinkedList lockTimesLinkedList;

	function getNode(uint ind) constant external returns (uint256[3]) {
		var node = lockTimesLinkedList.getNode(ind);
		return [node.previousNode, node.nodeData.voteIdsCount, node.nextNode];
	}

	modifier validAscendingInsertion(uint previousNodeId, uint newNode) {
		LockTimesLinkedList.Node previousNode = lockTimesLinkedList.getNode(previousNodeId);
		if (previousNodeId > newNode || (previousNode.nextNode < newNode && previousNode.nextNode != 0)) throw;
		_;
	}
	
	function hasVoteAtTime(uint lockTime, uint voteId) constant returns (bool) {
	    LockTimesLinkedList.NodeData storage lockTimeNodeData = lockTimesLinkedList.getNode(lockTime).nodeData;
	    return lockTimeNodeData.voteIds.isNode(voteId);
	}

	function insertVote(uint latestPreviousTime, uint lockTime, uint voteId) 
		validAscendingInsertion(latestPreviousTime, lockTime)
	{
		if (!lockTimesLinkedList.isNode(lockTime)) {
			lockTimesLinkedList.insert(latestPreviousTime, lockTime);
		}
		
		var lockTimeNodeData = lockTimesLinkedList.getNode(lockTime).nodeData;
		lockTimeNodeData.voteIdsCount++;
		
		var votesLinkedList = lockTimeNodeData.voteIds;
		votesLinkedList.insert(HEAD_AND_TAIL, voteId);
	}
	
	function removeVote(uint lockTime, uint voteId) {
	    var lockTimeNodeData = lockTimesLinkedList.getNode(lockTime).nodeData;
	    lockTimeNodeData.voteIdsCount--;
	    lockTimeNodeData.voteIds.remove(voteId);
	    
	    if (lockTimeNodeData.voteIdsCount == 0) {
	        lockTimesLinkedList.remove(lockTime);
	    }
	}

	function getEarliestUnrevealedVoteLockTime() constant returns (uint) {
		return lockTimesLinkedList.getNode(HEAD_AND_TAIL).nextNode;
	}
	
}