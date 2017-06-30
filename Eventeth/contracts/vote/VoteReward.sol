pragma solidity ^0.4.11;

// Turns out we can't do fractional calculations very easily. I'm not sure how this would best be calculated.
library VoteReward {
    
    struct GroupRewardAmounts {
        // We could put more stuff in here, eg nearly all vars in the FeeVote. Less calcs would be needed in this library then.
        uint minorityGroupReward;
        uint majorityGroupReward;
        uint winningVote;
        uint winningVoteContribution;
        uint losingVoteContribution;
    }
	
	// This math aint gonna check out, fractions etc...
	function getRewardAmount(GroupRewardAmounts storage self, uint voterDecision, uint voterVoteContribution, 
	    uint totalVotesFor, uint totalVotesAgainst, uint totalReward) 
	    returns (uint)
	{
	    if (self.minorityGroupReward == 0 && self.majorityGroupReward == 0) {
	        (self.minorityGroupReward, self.majorityGroupReward) = findGroupRewards(totalVotesFor, totalVotesAgainst, totalReward);
	        self.winningVote = totalVotesFor > totalVotesAgainst ? 0 : 1;
            self.winningVoteContribution = totalVotesFor > totalVotesAgainst ? totalVotesFor : totalVotesAgainst;
	        self.losingVoteContribution = totalVotesFor > totalVotesAgainst ? totalVotesFor : totalVotesAgainst;
	    }

		uint voterGroupReward = voterDecision == self.winningVote ? self.majorityGroupReward : self.minorityGroupReward;
		uint voterGroupVoteContribution = voterDecision == self.winningVote ? self.winningVoteContribution : self.losingVoteContribution; 
		uint voterReward = (voterGroupReward * voterVoteContribution) / voterGroupVoteContribution;
		
		return voterReward;
	}
	
	function findGroupRewards(uint totalVotesFor, uint totalVotesAgainst, uint totalReward) 
	    constant 
	    private
	    returns (uint minorityReward, uint majorityReward) 
	{
	    // I imagine rprop will be determined by the algorithm params. 
		uint rprop = 0;
	    // Unsure what discount factor is determined by, but it's either 0 or 1.
		uint discountFactor = 1;
		// This currently returns a large value due to overflow error. For now the scaling factor will always be 0 
		// since Solidity doesn't support fractional values yet. Not sure how to solve this.
// 		var scalingFactor = findScalingFactor(totalVotesFor, totalVotesAgainst);
        var scalingFactor = 0;
		// Tried to solve some of the fractional values problem by moving divisors and dividends around.
		var (pMinDividend, pMinDivisor) = findPMinValues(totalVotesFor, totalVotesAgainst);
		
		// The minority reward will currently always be 0.
	    minorityReward = (((totalReward - rprop) * pMinDividend) * discountFactor) / pMinDivisor * scalingFactor;
		majorityReward = totalReward - rprop - minorityReward;
	}
	
	function findScalingFactor(uint votesFor, uint votesAgainst) 
	    constant 
        private 
        returns (uint scalingFactor) 
    {
		uint pMin = votesFor > votesAgainst ? 
			votesAgainst / votesFor : votesFor / votesAgainst;
		uint pMax = votesFor > votesAgainst ? 
			votesFor / votesAgainst : votesAgainst / votesFor;
			
		scalingFactor = 1 - (pMax / (1 - pMin));
	}
	
	function findPMinValues(uint votesFor, uint votesAgainst) 
	    constant 
	    private 
	    returns (uint pMinDividend, uint pMinDivisor)
	{
	    pMinDividend = votesFor > votesAgainst ? votesAgainst : votesFor;
	    pMinDivisor = votesFor > votesAgainst ? votesFor : votesAgainst;
	}
	
}