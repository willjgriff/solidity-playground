pragma solidity ^0.4.11;

import "./FeeVote.sol";
import "../token/./ERC20Token.sol";

contract FeeVoteTest {

	using FeeVote for FeeVote.FeeVote;

	FeeVote.FeeVote feeVote;

	function initialise(ERC20Token voteToken) {
		feeVote.initialise(voteToken, "Should pass?", 60, 60);
	}
	
	function getSealedVote(address voter, FeeVote.VoteDecision voteDecision, bytes32 salt) constant returns (bytes32) {
	    return FeeVote.getSealedVote(voter, voteDecision, salt);
	}
	
	function castVote(bytes32 sealedVoteHash) {
		feeVote.castVote(sealedVoteHash);
	}

	function revealVote(FeeVote.VoteDecision voteDecision, bytes32 salt) {
		feeVote.revealVote(voteDecision, salt);
	}

	function claimReward() {
		feeVote.claimReward();
	}

	function winningVote() constant returns (FeeVote.VoteDecision) {
		return feeVote.winningVote();
	}
}