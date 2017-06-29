pragma solidity ^0.4.11;

// Turns out we can't do fractional calculations very easily. I'm not sure how this would best be calculated.
library VoteReward {
    
    struct GroupRewardAmounts {
        uint totalMinorityReward;
        uint totalMajorityReward;
    }
	
	function getRewardAmount(GroupRewardAmounts storage self, uint voterDecision, uint voterVoteContribution, 
	    uint totalVotesFor, uint totalVotesAgainst, uint totalReward) 
	    returns (uint)
	{
	    // This math aint gonna check out, fractions etc... more can be be cached.
	    uint winningVote = totalVotesFor > totalVotesAgainst ? 0 : 1;
	    
	    if (self.totalMinorityReward == 0 && self.totalMajorityReward == 0) {
	        var (minorityReward, majorityReward) = getGroupRewards(totalVotesFor, totalVotesAgainst, totalReward);
	    } else {
	        minorityReward = self.totalMinorityReward;
	        majorityReward = self.totalMajorityReward;
	    }

		uint voterGroupReward = voterDecision == winningVote ? majorityReward : minorityReward;
		uint groupVoteContribution = voterDecision == winningVote ? totalVotesFor : totalVotesAgainst; 
		return individualRewardAmount(groupVoteContribution, voterGroupReward, voterVoteContribution);
	}
	
	function getGroupRewards(uint totalVotesFor, uint totalVotesAgainst, uint totalReward) 
	    constant 
	    private
	    returns (uint minorityReward, uint majorityReward) 
	{
	    // I imagine rprop will be determined by the algorithm params. 
		uint rprop = 0;
	    // Unsure what discount factor is determined by, but it's either 0 or 1.
		uint discountFactor = 1;
		// The scaling factor will always be 0 since Solidity doesn't support fractional values yet. Not sure how to solve this.
		var scalingFactor = getScalingFactor(totalVotesFor, totalVotesAgainst);
		// Tried to solve some of the fractional values problem by moving divisors and dividends around.
		var (pMinDividend, pMinDivisor) = getPMinValues(totalVotesFor, totalVotesAgainst);
		
		// The minority reward will currently always be 0.
	    minorityReward = (((totalReward - rprop) * pMinDividend) * discountFactor) / pMinDivisor * scalingFactor;
		majorityReward = totalReward - rprop - minorityReward;
	}
	
	function getScalingFactor(uint votesFor, uint votesAgainst) 
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
	
	function getPMinValues(uint votesFor, uint votesAgainst) 
	    constant 
	    private 
	    returns (uint pMinDividend, uint pMinDivisor)
	{
	    pMinDividend = votesFor > votesAgainst ? votesAgainst : votesFor;
	    pMinDivisor = votesFor > votesAgainst ? votesFor : votesAgainst;
	}

	function individualRewardAmount(uint groupVoteContribution, uint totalGroupReward, uint voterVoteContribution)
	    constant
	    private
	    returns (uint)
	{
		return (totalGroupReward * voterVoteContribution) / groupVoteContribution;
	}
	
}