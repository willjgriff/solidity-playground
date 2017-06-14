pragma solidity ^0.4.11;

import "./Ownable.sol";
import "./VoteToken.sol";

contract FutarchyVote is Ownable {

	VoteToken voteToken;
    uint public votesFor;
    uint public votesAgainst;
    uint public voteEndTime;
    uint public testEndTime;
    
    // Need to protect against overflow, maybe use OpenZeppelin SafeMath...
    mapping(address => uint) votesCastFor;
    mapping(address => uint) votesCastAgainst;
    
    modifier hasBalance(uint voteTokens) {
        if (voteToken.balanceOf(msg.sender) > voteTokens) throw;
        _;
    }
    
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
    
    /**
     * @dev Constructor determines vote end time and test period end time.
     * @param voteDuration Specifies the length of the vote from now, in seconds.
     * @param testPeriodDuration specifies the lenth of the test period, 
     * from the end of the voting period, in seconds.
     */
    function FuntarchyVote(address voteTokenAddress, uint voteDuration, uint testPeriodDuration) {
    	voteToken = VoteToken(voteTokenAddress);
        voteEndTime = now + voteDuration;
        testEndTime = voteEndTime + testPeriodDuration;
    }
    
    function voteFor(uint numberOfVotes) 
        hasBalance(numberOfVotes)
        withinVotingPeriod
    {
        voteToken.transfer(this, numberOfVotes);
        votesCastFor[msg.sender] += numberOfVotes;
    }
    
    function voteAgainst(uint numberOfVotes) 
        hasBalance(numberOfVotes)
        withinVotingPeriod
    {
        voteToken.transfer(this, numberOfVotes);
        votesCastAgainst[msg.sender] += numberOfVotes;
    }
    
    /**
     * @dev After the voting period has ended, this function returns the result.
     * @return bool True if more votes for, false if more for votes against.
     */
    function votedFor() constant afterVotingPeriod returns (bool votedFor) {
        return votesFor > votesAgainst;
    }
    
    /**
     * @dev After the decision has been tested, specify its answer and reward
     * participants that voted correctly. Idelly this would trigger a call to an oracle.
     * @param success True if decision was successful, false if decision was unsucessful.
     */
    function testPeriodSuccess(bool success) afterTestPeriod onlyOwner {
        if (votedFor() && success || !votedFor() && success) {
            awardForVoters();
        } else { // if (votedFor() && !success || !votedFor() && !success)
            awardAgainstVoters();
        }
    }
    
    function awardForVoters() private {
        
    }
    
    function awardAgainstVoters() private {
        
    }

}