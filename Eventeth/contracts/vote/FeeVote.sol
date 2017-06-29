pragma solidity ^0.4.11;

import "../token/./ERC20Token.sol";
import "./VoteReward.sol";

contract FeeVote {
    
    using VoteReward for VoteReward.GroupRewardAmounts;
	
	enum VoteDecision { voteFor, voteAgainst }
	
	struct Voter {
		bytes32 sealedVoteHash;
		VoteDecision voteDecision;
		uint voteTokens;
	}
	
	ERC20Token voteToken;
	string public proposalDesc;
	uint public voteEndTime;
	uint public revealEndTime;
	// VoteDecision, represented as uint(voteDecision), mapped to number of votes
	mapping(uint => uint) public voteCounts;
	mapping(address => Voter) voters;
	VoteReward.GroupRewardAmounts groupRewardAmounts;
	
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
	
	modifier validVoteHash(VoteDecision voteDecision, bytes32 salt) {
		bytes32 voteHash = getSealedVote(msg.sender, voteDecision, salt);
		if (voters[msg.sender].sealedVoteHash != voteHash) throw;
		_;
	}

	/**
	 * This will fail if the fee required has not been approved for this contract to spend
	 */
	function FeeVote(address voteTokenAddress, string proposal, uint voteTime,
		uint revealTime) 
		payable
	{
		voteToken = ERC20Token(voteTokenAddress);
		proposalDesc = proposal;
		voteEndTime = now + voteTime;
		revealEndTime = now + revealTime;
	}
	
	// This can be removed when FeeVote is converted to a library.
	function payFee() {
		// TODO: Check the msg.value is that specified by the algorithm params in the registry for the cost of the fee.
		var fee = 100;
		voteToken.transferFrom(msg.sender, this, fee);
	}
	
	function getSealedVote(address voter, VoteDecision voteDecision, bytes32 salt) 
		constant 
		returns (bytes32)
	{
		return sha3(voter, voteDecision, salt);
	}
	
	function castVote(bytes32 sealedVoteHash) 
		// withinVotingPeriod
	{
		voters[msg.sender].sealedVoteHash = sealedVoteHash;
	}
	
	/**
	 * @dev Reveal the vote from the sending account with the random salt. Note as well as
	 * the modifier restrictions this can fail when the sender has already revealed their vote.
	 */
	function revealVote(VoteDecision voteDecision, bytes32 salt)
		// withinRevealPeriod
		validVoteHash(voteDecision, salt)
	{
		voters[msg.sender].sealedVoteHash = 0;
		voteCounts[uint(voteDecision)] += voteToken.balanceOf(msg.sender);
		voters[msg.sender].voteDecision = voteDecision;
		voters[msg.sender].voteTokens = voteToken.balanceOf(msg.sender);
	}

	event Debug(uint number, uint numero);
	
	function claimReward() 
		// afterRevealPeriod 
	{
	    uint voterDecision = uint(voters[msg.sender].voteDecision);
	    uint voterVoteContribution = voters[msg.sender].voteTokens;
	   	uint votesFor = voteCounts[uint(VoteDecision.voteFor)];
		uint votesAgainst = voteCounts[uint(VoteDecision.voteAgainst)];
		uint totalReward = voteToken.balanceOf(this);
	    
	    uint voterRewardAmount = groupRewardAmounts.getRewardAmount(voterDecision, voterVoteContribution, votesFor, votesAgainst, totalReward);
	    
        voteToken.transfer(msg.sender, voterRewardAmount);
	}
	
	function winningVote() constant returns (VoteDecision)
	    //afterRevealPeriod
	{
		var votesFor = voteCounts[uint(VoteDecision.voteFor)];
		var votesAgainst = voteCounts[uint(VoteDecision.voteAgainst)];
		return votesFor > votesAgainst ? VoteDecision.voteFor : VoteDecision.voteAgainst;
	}
	
}