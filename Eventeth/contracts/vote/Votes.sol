pragma solidity 0.4.11;

import "./FeeVote.sol";
import "../token/./LockableVoteToken.sol";
import "./unrevealedLockTimes/UnrevealedLockTimes.sol";

// DON'T FORGET TO UNCOMMENT THE REQUIRE STATEMENTS IN THE FEEVOTE LIBRARY.
// ALSO: msg.sender won't be the sender when this is called from another contract. Rejigging will be required or maybe this will become a library...
// ALSO: still need to add a function to get the list of lock times.
// ALSO: make total supply of LockableVoteTokens MASSIVE.
contract Votes {

    using UnrevealedLockTimes for UnrevealedLockTimes.LockTimes;
    using FeeVote for FeeVote.FeeVote;
    
    // Used to return voteId;
    event VoteCreated(uint voteId, string voteDescription);
    
    LockableVoteToken voteToken;
    // This starts from 1 not 0 because it will be an index in a LinkedList with head and tail that is 0;
    uint idCount = 1;
    mapping(uint => FeeVote.FeeVote) votes;
    mapping(address => UnrevealedLockTimes.LockTimes) unrevealedLockTimes;

    function setTokenAddress(address tokenAddress) {
        voteToken = LockableVoteToken(tokenAddress);
    }
    
    function createVote(string voteDescription, uint voteTime, uint revealTime) {
        votes[idCount].initialise(voteToken, voteDescription, voteTime, revealTime);
        VoteCreated(idCount, voteDescription);
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

    // // TODO: For testing, delete this
    function blockTimeNow() constant returns (uint) {
        return now;
    }
    
    function voterEarliestTokenLockTime(address voter) constant returns (uint) {
        return unrevealedLockTimes[voter].getEarliestUnrevealedVoteLockTime();
    }
    
    function latestPreviousLockTime(address voter, uint voteId) constant returns (uint) {
        uint tokenLockTime = votes[voteId].voteEndTime;
        return unrevealedLockTimes[voter].getLatestPreviousLockTimeForTime(tokenLockTime);
    }

    // TODO: DELETE THIS
    function getUnrevealedNode(address voter, uint lockTime) constant returns (uint256[3]) {
        return unrevealedLockTimes[voter].getNode(lockTime);
    }
}