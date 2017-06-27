pragma solidity 0.4.11;

import "./FeeVote.sol";
import "./unrevealedLockTimes/LockTimesLinkedList.sol";
import "./unrevealedLockTimes/UnrevealedLockTimes.sol";

contract Votes {

    using UnrevealedLockTimes for LockTimesLinkedList.LinkedList;

    struct Vote {
        string voteDescription;
        FeeVote feeVote;
    }
    
    // TODO: This shouldn't be public.
    uint public idCount = 0;
    mapping(uint => Vote) public votes;
    mapping(address => LockTimesLinkedList.LinkedList) unrevealedLockTimes;
    
    function createVote(address tokenAddress, string voteDescription,
        uint voteTime, uint revealTime)
        payable
    {
        FeeVote feeVote = new FeeVote(tokenAddress, voteDescription, voteTime, revealTime);
        votes[idCount] = Vote(voteDescription, feeVote);
        idCount++;
    }
    
    /**
     * @param previousLockTime The latest lock time before the lock time at the vote with voteId.
     */
    function castVote(uint voteId, bytes32 sealedVoteHash, uint previousLockTime) {
        votes[voteId].feeVote.castVote(sealedVoteHash);
        uint voteEndTime = votes[voteId].feeVote.voteEndTime();
        unrevealedLockTimes[msg.sender].insertVoteAtTime(previousLockTime, voteEndTime, voteId);
    }
    
    function revealVote(uint voteId, FeeVote.VoteDecision voteDecision, bytes32 salt) {
        votes[voteId].feeVote.revealVote(voteDecision, salt);
        uint voteEndTime = votes[voteId].feeVote.voteEndTime();
        unrevealedLockTimes[msg.sender].removeVoteAtTime(voteEndTime, voteId);
    }
    
    function voterEarliestTokenLockTime(address voter) returns (uint) {
        return unrevealedLockTimes[voter].getEarliestUnrevealedVoteLockTime();
    }
}