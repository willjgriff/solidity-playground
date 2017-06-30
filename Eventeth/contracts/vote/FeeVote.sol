pragma solidity ^0.4.11;

import "../token/./ERC20Token.sol";
import "./VoteReward.sol";

library FeeVote {
    
    using VoteReward for VoteReward.GroupRewardAmounts;
	
	enum VoteDecision { voteFor, voteAgainst }
	
	struct Voter {
		bytes32 sealedVoteHash;
		VoteDecision voteDecision;
		uint voteTokens;
		bool rewardClaimed;
	}
	
	struct FeeVote {
    	ERC20Token voteToken;
    	string proposalDesc;
    	uint voteEndTime;
    	uint revealEndTime;
    	// VoteDecision, represented as uint(voteDecision), mapped to number of votes
    	mapping(uint => uint) voteCounts;
    	mapping(address => Voter) voters;
    	VoteReward.GroupRewardAmounts groupRewardAmounts;
	}
	
	function withinVotingPeriod(FeeVote storage self) private returns (bool) {
		if (now > self.voteEndTime) return false;
		return true;
	}
	
	function withinRevealPeriod(FeeVote storage self) private returns (bool) {
		if (now < self.voteEndTime || now > self.revealEndTime) return false;
		return true;
	}
	
	function afterRevealPeriod(FeeVote storage self) private returns (bool) {
		if (now < self.revealEndTime) return false;
		return true;
	}
	
	function validVoteHash(FeeVote storage self, VoteDecision voteDecision, bytes32 salt) private returns (bool) {
		bytes32 voteHash = getSealedVote(msg.sender, voteDecision, salt);
		if (self.voters[msg.sender].sealedVoteHash != voteHash) return false;
		return true;
	}
	
	function rewardNotClaimed(FeeVote storage self, address voter) private returns (bool) {
	    if (self.voters[voter].rewardClaimed == true) return false;
	    return true;
	}

	/**
	 * Note this will fail if the fee required has not been approved for this contract to spend
	 */
	function initialise(FeeVote storage self, ERC20Token voteToken, string proposal,
	    uint voteTime, uint revealTime) 
	    internal
	{
		self.voteToken = voteToken;
		self.proposalDesc = proposal;
		self.voteEndTime = now + voteTime;
		self.revealEndTime = now + revealTime;
		
	    // TODO: Check the registry / algorithm params for the cost of the fee.
		var fee = 100;
		self.voteToken.transferFrom(msg.sender, this, fee);
	}
	
	function getSealedVote(address voter, VoteDecision voteDecision, bytes32 salt) 
		internal
		constant
		returns (bytes32)
	{
		return sha3(voter, voteDecision, salt);
	}
	
	function castVote(FeeVote storage self, bytes32 sealedVoteHash) {
	   // require(withinVotingPeriod(self));
	    
		self.voters[msg.sender].sealedVoteHash = sealedVoteHash;
	}
	
	/**
	 * @dev Reveal the vote from the sending account with the random salt. Note as well as
	 * the modifier restrictions this can fail when the sender has already revealed their vote.
	 */
	function revealVote(FeeVote storage self, VoteDecision voteDecision, bytes32 salt) internal {
	   // require(withinRevealPeriod(self));
	    require(validVoteHash(self, voteDecision, salt));
	    
		self.voters[msg.sender].sealedVoteHash = 0;
		self.voteCounts[uint(voteDecision)] += self.voteToken.balanceOf(msg.sender);
		self.voters[msg.sender].voteDecision = voteDecision;
		self.voters[msg.sender].voteTokens = self.voteToken.balanceOf(msg.sender);
	}
	
	function claimReward(FeeVote storage self) internal {
	    require(rewardNotClaimed(self, msg.sender));
	   // require(afterRevealPeriod(self));
	    
	    uint voterDecision = uint(self.voters[msg.sender].voteDecision);
	    uint voterVoteContribution = self.voters[msg.sender].voteTokens;
	   	uint votesFor = self.voteCounts[uint(VoteDecision.voteFor)];
		uint votesAgainst = self.voteCounts[uint(VoteDecision.voteAgainst)];
		uint totalReward = self.voteToken.balanceOf(this);
	    
	    uint voterRewardAmount = self.groupRewardAmounts.getRewardAmount(voterDecision, voterVoteContribution, votesFor, votesAgainst, totalReward);
        self.voteToken.transfer(msg.sender, voterRewardAmount);
        
        self.voters[msg.sender].rewardClaimed = true;
	}
	
	function winningVote(FeeVote storage self) constant internal returns (VoteDecision) {
	   // require(afterRevealPeriod(self));
	    
		var votesFor = self.voteCounts[uint(VoteDecision.voteFor)];
		var votesAgainst = self.voteCounts[uint(VoteDecision.voteAgainst)];
		return votesFor > votesAgainst ? VoteDecision.voteFor : VoteDecision.voteAgainst;
	}
	
}