pragma solidity ^0.4.11;

import "./UnrevealedLockTimes.sol";

// Contract for testing the UnrevealedLockTimes library. Serves no useful purpose.
contract UnrevealedLockTimesTest {

	using UnrevealedLockTimes for UnrevealedLockTimes.LockTimes;

	UnrevealedLockTimes.LockTimes lockTimes;

	function getNode(uint id) constant returns (uint256[3]) {
		return lockTimes.getNode(id);
	}
	
	function insertVoteAtTime(uint latestPreviousTime, uint lockTime, uint voteId) {
		lockTimes.insertVoteAtTime(latestPreviousTime, lockTime, voteId);
	}
	
	function removeVoteAtTime(uint lockTime, uint voteId) {
		lockTimes.removeVoteAtTime(lockTime, voteId);
	}
	
	function getEarlyTime() constant returns (uint) {
		return lockTimes.getEarliestUnrevealedVoteLockTime();
	}
}