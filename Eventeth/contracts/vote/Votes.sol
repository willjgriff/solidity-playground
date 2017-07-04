pragma solidity ^0.4.11;

import "./FeeVote.sol";
import "../token/./LockableVoteToken.sol";
import "./unrevealedLockTimes/UnrevealedLockTimes.sol";

// DON'T FORGET TO UNCOMMENT THE TIMED REQUIRE STATEMENTS IN THE FEEVOTE LIBRARY.
// ALSO: This should become a library if exclusively used from another contract. 
// Otherwise msg.sender may not be the sender when this is called from another contract.
// ALSO: make total supply of LockableVoteTokens MASSIVE.
contract Votes {

    using UnrevealedLockTimes for UnrevealedLockTimes.LockTimes;
    using FeeVote for FeeVote.FeeVote;
    
    // Used to return voteId;
    event LogVoteCreated(uint voteId, string voteDescription);
    
    LockableVoteToken private voteToken;
    // This starts from 1 not 0 because it will be an index in a LinkedList with head and tail that is 0;
    uint public idCount = 1;
    mapping(uint => FeeVote.FeeVote) private votes;
    mapping(address => UnrevealedLockTimes.LockTimes) private unrevealedLockTimes;

    function setTokenAddress(address tokenAddress) {
        voteToken = LockableVoteToken(tokenAddress);
    }
    
    function createVote(string voteDescription, uint voteTime, uint revealTime) {
        votes[idCount].initialise(voteToken, voteDescription, voteTime, revealTime);
        LogVoteCreated(idCount, voteDescription);
        idCount++;
    }

    function getSealedVote(address voter, FeeVote.VoteDecision voteDecision, bytes32 salt) constant returns (bytes32) {
        return FeeVote.getSealedVote(voter, voteDecision, salt);
    }
    
    /**
     * @dev Cast vote with the given Id. Could fail when:
     * The voting period has expired
     * The previousLockTime is not the valid previousLockTime
     * 
     * @param previousLockTime The latest lock time before the lock time at the vote with voteId.
     */
    function castVote(uint voteId, bytes32 sealedVoteHash, uint previousLockTime) {
        votes[voteId].castVote(sealedVoteHash);
        uint voteEndTime = votes[voteId].voteEndTime;
        unrevealedLockTimes[msg.sender].insertVoteAtTime(previousLockTime, voteEndTime, voteId);
    }
    
    function revealVote(uint voteId, FeeVote.VoteDecision voteDecision, bytes32 salt) {
        votes[voteId].revealVote(voteDecision, salt);

        uint voteEndTime = votes[voteId].voteEndTime;
        unrevealedLockTimes[msg.sender].removeVoteAtTime(voteEndTime, voteId);

        if (unrevealedLockTimes[msg.sender].getEarliestUnrevealedVoteLockTime() < now) {
            voteToken.updateUnlockedBalance(msg.sender);
        }
    }
    
    function claimReward(uint voteId) {
        votes[voteId].claimReward();
    }
    
    function voterEarliestTokenLockTime(address voter) constant returns (uint) {
        return unrevealedLockTimes[voter].getEarliestUnrevealedVoteLockTime();
    }
    
    function latestPreviousLockTime(address voter, uint voteId) constant returns (uint) {
        uint tokenLockTime = votes[voteId].voteEndTime;
        return unrevealedLockTimes[voter].getLatestPreviousLockTimeForTime(tokenLockTime);
    }
}