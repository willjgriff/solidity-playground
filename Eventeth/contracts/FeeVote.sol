pragma solidity ^0.4.11;

import "./LockableVoteToken.sol";

contract FeeVote {
    
    enum VoteDecision { voteFor, voteAgainst }
    
    struct Voter {
        bytes32 sealedVoteHash;
        VoteDecision voteDecision;
    }
    
    LockableVoteToken voteToken;
    string public proposalDesc;
    uint public votesFor;
    uint public votesAgainst;
    uint public voteEndTime;
    uint public revealEndTime;
    // VoteDecision, represented as uint(voteDecision), mapped to number of votes
    mapping(uint => uint) voteCounts;
    mapping(address => Voter) voters;
    
    modifier withinVotingPeriod() {
		if (now > voteEndTime) throw;
		_;
	}
	
	modifier withinRevealPeriod() {
		if (now < voteEndTime || now > revealEndTime) throw;
		_;
	}
	
	modifier afterRevealPeriod() {
	    if (now < revealEndTime) throw;
	    _;
	}
	
	modifier checkAndUpdateVoteHash(VoteDecision voteDecision, bytes32 salt) {
        bytes32 voteHash = getSealedVote(msg.sender, voteDecision, salt);
        if (voters[msg.sender].sealedVoteHash != voteHash) throw;
        voters[msg.sender].sealedVoteHash = 0;
        _;
    }

	function FeeVote(LockableVoteToken _voteToken, string proposal, uint voteTime, uint revealTime) 
	    payable
	{
	    // TODO: Check the msg.value is that specified by the algorithm params in the registry.
		voteToken = _voteToken;
		proposalDesc = proposal;
		voteEndTime = now + voteTime;
		revealEndTime = now + revealTime;
	}
	
	function() {
	    throw;
	}
	
	function getSealedVote(address voter, VoteDecision voteDecision, bytes32 salt) 
	    constant 
	    returns (bytes32)
	{
	    return sha3(voter, voteDecision, salt);
	}
	
	function castVote(bytes32 sealedVoteHash) 
	    withinVotingPeriod
	{
	    voters[msg.sender].sealedVoteHash = sealedVoteHash;
	}
	
	function revealVote(VoteDecision voteDecision, bytes32 salt)
	    withinRevealPeriod
	    checkAndUpdateVoteHash(voteDecision, salt)
	{
	    voteCounts[uint(voteDecision)] += voteToken.balanceOf(msg.sender);
	    voters[msg.sender].voteDecision = voteDecision;
	}
	
	function claimReward() afterRevealPeriod {
	    // This math aint gonna check out, fractions etc... calcs can also be cached.
	    uint totalReward = this.balance;
	    uint rprop = 0;
	    uint pmin = winningVote() == VoteDecision.voteFor ? 
	        votesAgainst / votesFor : votesFor / votesAgainst;
	    uint scalingFactor = 1 - (pmin / (1 - pmin));
	    
	    uint minorityReward = (totalReward - rprop) * pmin * scalingFactor;
	    uint majorityReward = totalReward - rprop - minorityReward;
	    
	    if (voters[msg.sender].voteDecision == winningVote()) {
	       // msg.sender.transfer()
	    }
	}
	
	function winningVote()
	    constant 
	    afterRevealPeriod 
	    returns (VoteDecision)
	{
	    votesFor > votesAgainst ? VoteDecision.voteFor : VoteDecision.voteAgainst;
	}
	
}