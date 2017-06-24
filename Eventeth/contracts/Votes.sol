pragma solidity 0.4.11;

import "./FeeVote.sol";
import "./LockableVoteToken.sol";
import "./CircularLinkedList.sol";

contract Votes {
    
    using CircularLinkedList for CircularLinkedList.LinkedList;

    struct Vote {
        string voteDesc;
        FeeVote feeVote;
    }
    
    uint idCount = 0;
    mapping(uint => Vote) public votes;
    mapping(address => CircularLinkedList.LinkedList) votersTokenLockTimes;
    
    modifier previousLockTimeCorrect(uint voteId, uint previousLockTime) {
        uint voteEndTime = votes[voteId].feeVote.voteEndTime();
        uint nextEndTime = votersTokenLockTimes[msg.sender].getNode(previousLockTime).nextNode;
        if (previousLockTime < voteEndTime && nextEndTime > voteEndTime) throw;
        _;
    }
    
    function createVote(LockableVoteToken lockableVoteToken, string voteDesc,
                        uint voteTime, uint revealTime)
        payable
    {
        FeeVote feeVote = new FeeVote(lockableVoteToken, voteDesc, voteTime, revealTime);
        votes[idCount] = Vote(voteDesc, feeVote);
        idCount++;
    }
    
    /**
     * @param previousLockTime The latest lock time before the lock time at the vote with voteId.
     */
    function castVote(uint voteId, bytes32 sealedVoteHash, uint previousLockTime)
        previousLockTimeCorrect(voteId, previousLockTime)
    {
        votes[voteId].feeVote.castVote(sealedVoteHash);
        uint voteEndTime = votes[voteId].feeVote.voteEndTime();
        votersTokenLockTimes[msg.sender].insert(previousLockTime, voteEndTime);
    }
    
    function revealVote(uint voteId, FeeVote.VoteDecision voteDecision, bytes32 salt) {
        votes[voteId].feeVote.revealVote(voteDecision, salt);
        votersTokenLockTimes[msg.sender].remove(votes[voteId].feeVote.voteEndTime());
    }
    
    function voterEarliestTokenLockTime(address voter) returns (uint) {
        return votersTokenLockTimes[voter].getNode(0).nextNode;
    }
}