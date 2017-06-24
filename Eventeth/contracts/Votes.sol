pragma solidity 0.4.11;

import "./FeeVote.sol";
import "./LockableVoteToken.sol";

contract Votes {
    
    struct Vote {
        string voteDesc;
        FeeVote feeVote;
    }
    
    uint idCount = 0;
    mapping(uint => Vote) public votes;
    mapping(address => uint[]) public votersTokenLockTimes;
    
    function createVote(LockableVoteToken lockableVoteToken, string voteDesc,
                        uint voteTime, uint revealTime)
        payable
    {
        FeeVote feeVote = new FeeVote(lockableVoteToken, voteDesc, voteTime, revealTime);
        votes[idCount] = Vote(voteDesc, feeVote);
        idCount++;
    }
    
    function castVote(uint voteId, bytes32 sealedVoteHash) {
        votes[voteId].feeVote.castVote(sealedVoteHash);
        uint voteEndTime = votes[voteId].feeVote.voteEndTime();
        votersTokenLockTimes[msg.sender].push(voteEndTime);
    }
    
    function revealVote(uint voteId, FeeVote.VoteDecision voteDecision, bytes32 salt) {
        votes[voteId].feeVote.revealVote(voteDecision, salt);
        // votersTokenLockTimes[msg.sender].pop(0);
    }
}