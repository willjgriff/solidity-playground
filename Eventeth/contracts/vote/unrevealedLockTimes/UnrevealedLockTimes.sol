pragma solidity ^0.4.11;

import "./LockTimesLinkedList.sol";
import "./VoteIdsLinkedList.sol";

library UnrevealedLockTimes {
    
    uint constant HEAD_AND_TAIL = 0;
    
	using LockTimesLinkedList for LockTimesLinkedList.LinkedList;
	using VoteIdsLinkedList for VoteIdsLinkedList.LinkedList;
	
	function getNode(LockTimesLinkedList.LinkedList storage self, uint ind) 
	    constant 
	    external 
	    returns (uint256[3])
	{
		var node = self.getNode(ind);
		return [node.previousNode, node.nodeData.voteIdsCount, node.nextNode];
	}

	function validAscendingInsertion(LockTimesLinkedList.LinkedList storage self,
	    uint previousNodeId, uint newNode)
	    returns (bool)
	{
		LockTimesLinkedList.Node previousNode = self.getNode(previousNodeId);
		if (previousNodeId > newNode || (previousNode.nextNode < newNode && previousNode.nextNode != 0)) return false;
		return true;
	}

	function insertVoteAtTime(LockTimesLinkedList.LinkedList storage self, 
	    uint latestPreviousTime, uint lockTime, uint voteId) 
	{
	    require(validAscendingInsertion(self, latestPreviousTime, lockTime));
	    
		if (!self.isNode(lockTime)) {
			self.insert(latestPreviousTime, lockTime);
		}
		
		var lockTimeNodeData = self.getNode(lockTime).nodeData;
		lockTimeNodeData.voteIdsCount++;
		
		var votesLinkedList = lockTimeNodeData.voteIds;
		votesLinkedList.insert(HEAD_AND_TAIL, voteId);
	}
	
	function removeVoteAtTime(LockTimesLinkedList.LinkedList storage self, uint lockTime, uint voteId) {
	    var lockTimeNodeData = self.getNode(lockTime).nodeData;
	    lockTimeNodeData.voteIdsCount--;
	    lockTimeNodeData.voteIds.remove(voteId);
	    
	    if (lockTimeNodeData.voteIdsCount == 0) {
	        self.remove(lockTime);
	    }
	}

	function getEarliestUnrevealedVoteLockTime(LockTimesLinkedList.LinkedList storage self) constant returns (uint) {
		return self.getNode(HEAD_AND_TAIL).nextNode;
	}
	
}