pragma solidity ^0.4.11;

import "./LinkedList.sol";

// This encapsulates a linked list of lock times and the data that belongs to each of it's nodes. The LinkedList
// is used for ordering but each nodes data lives in this contract. This enables us to reuse the LinkedList.
// NOTE: The inner votesIds LinkedList is useful to see which voteIds a lockTime relate to.
library UnrevealedLockTimes {
    
    uint constant HEAD_AND_TAIL = 0;
    
	using LinkedList for LinkedList.LinkedList;
    
    struct LockTimes {
        LinkedList.LinkedList lockTimesLinkedList;
        mapping (uint => LockTimeNodeData) lockTimesNodeData;
    }
    
    struct LockTimeNodeData {
        LinkedList.LinkedList voteIds;
        uint voteIdsCount;
    }
	
	// Purely for testing purposes, can be removed when confirmed to work.
	function getNode(UnrevealedLockTimes.LockTimes storage self, uint lockTime) 
	    constant
	    returns (uint256[3])
	{
	    var node = self.lockTimesLinkedList.getNode(lockTime);
		var nodeData = self.lockTimesNodeData[lockTime];
		return [node.previousNode, nodeData.voteIdsCount, node.nextNode];
	}

	function validAscendingInsertion(UnrevealedLockTimes.LockTimes storage self,
	    uint previousNodeId, uint newNode)
	    returns (bool)
	{
		LinkedList.Node previousNode = self.lockTimesLinkedList.getNode(previousNodeId);
		if (previousNodeId > newNode || (previousNode.nextNode < newNode && previousNode.nextNode != 0)) return false;
		return true;
	}

	function insertVoteAtTime(UnrevealedLockTimes.LockTimes storage self, 
	    uint latestPreviousTime, uint lockTime, uint voteId) 
	{
	    require(validAscendingInsertion(self, latestPreviousTime, lockTime));
	    
		if (!self.lockTimesLinkedList.isNode(lockTime)) {
			self.lockTimesLinkedList.insert(latestPreviousTime, lockTime);
		}
		
		var lockTimeNodeData = self.lockTimesNodeData[lockTime];
		lockTimeNodeData.voteIdsCount++;
		
		var votesLinkedList = lockTimeNodeData.voteIds;
		votesLinkedList.insert(HEAD_AND_TAIL, voteId);
	}
	
	function removeVoteAtTime(UnrevealedLockTimes.LockTimes storage self, uint lockTime, uint voteId) {
	    require(self.lockTimesLinkedList.isNode(lockTime));
	    
	    var lockTimeNodeData = self.lockTimesNodeData[lockTime];
	    lockTimeNodeData.voteIdsCount--;
	    lockTimeNodeData.voteIds.remove(voteId);
	    
	    if (lockTimeNodeData.voteIdsCount == 0) {
	        self.lockTimesLinkedList.remove(lockTime);
	    }
	}

	function getEarliestUnrevealedVoteLockTime(UnrevealedLockTimes.LockTimes storage self) constant returns (uint) {
		return self.lockTimesLinkedList.getNode(HEAD_AND_TAIL).nextNode;
	}
	
}