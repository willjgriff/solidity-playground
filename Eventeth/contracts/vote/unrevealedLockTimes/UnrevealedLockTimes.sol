pragma solidity ^0.4.11;

import "./LinkedList.sol";

// This encapsulates a linked list of lock times and the data that belongs to each of it's nodes. The LinkedList
// is used for ordering but each nodes data lives in this contract. This enables us to reuse the LinkedList.
// NOTE: The inner votesIds LinkedList is useful to see which voteIds a lockTime relate to.
library UnrevealedLockTimes {
    
	using LinkedList for LinkedList.LinkedList;
    
    struct LockTimes {
        LinkedList.LinkedList lockTimesLinkedList;
        mapping (uint => LockTimeNodeData) lockTimesNodeData;
    }
    
    struct LockTimeNodeData {
        LinkedList.LinkedList voteIds;
        uint voteIdsCount;
    }
	
	// TODO: Purely for testing purposes, can be removed when confirmed to work.
	function getNode(UnrevealedLockTimes.LockTimes storage self, uint lockTime) 
	    constant
	    returns (uint256[3])
	{
	    var node = self.lockTimesLinkedList.getNode(lockTime);
		var nodeData = self.lockTimesNodeData[lockTime];
		return [node.previousNode, nodeData.voteIdsCount, node.nextNode];
	}

	function validAscendingInsertion(UnrevealedLockTimes.LockTimes storage self, uint previousNodeId, uint newNode)
	    internal
	    returns (bool)
	{
		LinkedList.Node previousNode = self.lockTimesLinkedList.getNode(previousNodeId);
		if (previousNodeId > newNode || (previousNode.nextNode < newNode && previousNode.nextNode != 0)) return false;
		return true;
	}

	function insertVoteAtTime(UnrevealedLockTimes.LockTimes storage self, 
	    uint latestPreviousTime, uint lockTime, uint voteId) 
	    internal
	{
	    require(validAscendingInsertion(self, latestPreviousTime, lockTime));
	    
		if (!self.lockTimesLinkedList.isNode(lockTime)) {
			self.lockTimesLinkedList.insert(latestPreviousTime, lockTime);
		}
		
		var lockTimeNodeData = self.lockTimesNodeData[lockTime];
		lockTimeNodeData.voteIdsCount++;
		
		var votesLinkedList = lockTimeNodeData.voteIds;
		votesLinkedList.insert(LinkedList.headTailIndex(), voteId);
	}
	
	function removeVoteAtTime(UnrevealedLockTimes.LockTimes storage self, uint lockTime, uint voteId)
	    internal
	{
	    require(self.lockTimesLinkedList.isNode(lockTime));
	    
	    var lockTimeNodeData = self.lockTimesNodeData[lockTime];
	    lockTimeNodeData.voteIdsCount--;
	    lockTimeNodeData.voteIds.remove(voteId);
	    
	    if (lockTimeNodeData.voteIdsCount == 0) {
	        self.lockTimesLinkedList.remove(lockTime);
	    }
	}

	function getEarliestUnrevealedVoteLockTime(UnrevealedLockTimes.LockTimes storage self) 
	    internal
	    constant 
	    returns (uint)
	{
		return self.lockTimesLinkedList.getNode(LinkedList.headTailIndex()).nextNode;
	}
	
	function getLatestPreviousLockTimeForTime(UnrevealedLockTimes.LockTimes storage self, uint lockTime) 
	    internal
	    constant 
	    returns (uint)
	{
	    uint currentLockTime = LinkedList.headTailIndex();
	    while (self.lockTimesLinkedList.getNode(currentLockTime).nextNode != 0
	        && self.lockTimesLinkedList.getNode(currentLockTime).nextNode < lockTime) {
	        currentLockTime = self.lockTimesLinkedList.getNode(currentLockTime).nextNode;
	    }
	    return currentLockTime;
	}
	
}