pragma solidity 0.4.11;

import "./FeeVote.sol";
import "../token/./LockableVoteToken.sol";
import "./unrevealedLockTimes/UnrevealedLockTimes.sol";

contract Votes {

    using UnrevealedLockTimes for UnrevealedLockTimes.LockTimes;
    
    // Used to return voteId;
    event VoteCreated(uint voteId, string voteDescription);

    struct Vote {
        string voteDescription;
        FeeVote feeVote;
    }
    
    LockableVoteToken voteToken;
    uint idCount = 0;
    mapping(uint => Vote) public votes;
    mapping(address => UnrevealedLockTimes.LockTimes) unrevealedLockTimes;

    function setTokenAddress(address tokenAddress) {
        voteToken = LockableVoteToken(tokenAddress);
    }
    
    function createVote(string voteDescription, uint voteTime, uint revealTime)
        payable
    {
        FeeVote feeVote = new FeeVote(voteToken, voteDescription, voteTime, revealTime);
        votes[idCount] = Vote(voteDescription, feeVote);
        VoteCreated(idCount, voteDescription);
        idCount++;
    }
    
    /**
     * @dev Cast vote with the given Id. Could fail when:
     * The voting period has expired
     * The previousLockTime is not the valid previousLockTime
     * 
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

        if (unrevealedLockTimes[msg.sender].getEarliestUnrevealedVoteLockTime() < now) {
            voteToken.updateUnlockedBalance(msg.sender);
        }
    }
    
    function voterEarliestTokenLockTime(address voter) returns (uint) {
        return unrevealedLockTimes[voter].getEarliestUnrevealedVoteLockTime();
    }
}