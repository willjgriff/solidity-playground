pragma solidity ^0.4.11;

import "./Ownable.sol";
import "./VoteToken.sol";

contract FutarchyVote is Ownable {

	VoteToken voteToken;
	uint public votesFor;
	uint public votesAgainst;
	uint public voteEndTime;
	uint public testEndTime;
	bool public testPeriodSuccessful;
	bool public testOutcomeDecided;
	
	// Need to protect against overflow, maybe use OpenZeppelin SafeMath... 
	// Also need to consider rounding error.
	mapping(address => uint) votesCastFor;
	mapping(address => uint) votesCastAgainst;
	
	modifier withinVotingPeriod() {
		if (now > voteEndTime) throw;
		_;
	}
	
	modifier afterVotingPeriod() {
		if (now < voteEndTime) throw;
		_;
	}
	
	modifier afterTestPeriod() {
		if (now < testEndTime) throw;
		_;
	}
	
	modifier _testOutcomeDecided() {
	    if (!testOutcomeDecided) throw;
	    _;
	}
	
	/**
	 * @dev Constructor determines vote end time and test period end time.
	 * @param voteDuration Specifies the length of the vote from now, in seconds.
	 * @param testPeriodDuration specifies the lenth of the test period, 
	 * from the end of the voting period, in seconds.
	 */
	function FutarchyVote(address voteTokenAddress, uint voteDuration, uint testPeriodDuration) {
		voteToken = VoteToken(voteTokenAddress);
		voteEndTime = now + voteDuration;
		testEndTime = voteEndTime + testPeriodDuration;
	}
	
	/**
	 * @dev Cast numberOfVotes in favour of the subject. Requires granting the 
	 * VoteToken access to at-least the numberOfVotes the caller is attempting to use.
	 * @param numberOfVotes Specifies the number of votes to cast.
	 */
	function voteFor(uint numberOfVotes) 
		withinVotingPeriod
	{
		voteToken.transferFrom(msg.sender, this, numberOfVotes);
		votesCastFor[msg.sender] += numberOfVotes;
		votesFor += numberOfVotes;
	}
	
	/**
	 * @dev Cast numberOfVotes against the vote subject. Requires granting the 
	 * VoteToken access to at-least the numberOfVotes the caller is attempting to use.
	 * @param numberOfVotes Specifies the number of votes to cast.
	 */
	function voteAgainst(uint numberOfVotes) 
		withinVotingPeriod
	{
		voteToken.transferFrom(msg.sender, this, numberOfVotes);
		votesCastAgainst[msg.sender] += numberOfVotes;
		votesAgainst += numberOfVotes;
	}
	
	/**
	 * @dev After the voting period has ended, this function returns the result.
	 * @return bool True if more votes for, false if more for votes against.
	 */
	function votedFor() 
		constant
		afterVotingPeriod 
		returns (bool votedFor)
	{
		return votesFor > votesAgainst;
	}
	
	/**
	 * @dev After the decision has been tested, specify its answer. 
	 * Idelly this would trigger a call to an oracle or the owner would be a multi-sig address.
	 * @param success True if decision was successful, false if decision was unsucessful.
	 */
	function testPeriodSuccess(bool success) 
		afterTestPeriod
		onlyOwner
	{
		testPeriodSuccessful = success;
		testOutcomeDecided = true;
	}
	
	/**
	 * @dev Claim back vote tokens and rewarded vote tokens if voted correctly. 
	 * If no tokens are won then a tx of 0 vote tokens will be made to the sender.
	 */
	function claimReward()
		_testOutcomeDecided
	{
		if (votedFor() == testPeriodSuccessful) {
			awardForVoter();
		} else {
			awardAgainstVoter();
		}
	}

	// This contract will end up keeping 1 VoteToken if the losers VoteTokens do not divide between
	// the winners into whole numbers. We can't prevent this for now but if we change the VoteToken
	// contract so that one VoteToken is represented by 10**18 weiVoteTokens and the VoteToken 
	// contract deals in weiVoteTokens, we can make the value of that 1 weiVoteToken irrelevantly small.
	function awardForVoter() private {
		uint awardAmount = (votesAgainst * votesCastFor[msg.sender]) / votesFor;
		uint totalReturnAmount = votesCastFor[msg.sender] + awardAmount;
		votesCastFor[msg.sender] = 0;
		voteToken.transfer(msg.sender, totalReturnAmount);
	}

	function awardAgainstVoter() private {
		uint awardAmount = (votesFor * votesCastAgainst[msg.sender]) / votesAgainst;
		uint totalReturnAmount = votesCastAgainst[msg.sender] + awardAmount;
		votesCastAgainst[msg.sender] = 0;
		voteToken.transfer(msg.sender, totalReturnAmount);
	}

}