pragma solidity ^0.4.15;

import "./MiniMeToken.sol";
import "./LinkedList.sol";

contract LiquidVote {

    using LinkedList for LinkedList.LinkedList;

    MiniMeToken private voteToken;
    uint public votesFor;
    uint public votesAgainst;

    struct Voter {
        bool voteDirection;
        bool hasVoted;
        int votedArrayPosition;
        address delegatedToVoter;
        LinkedList.LinkedList delegatedFromVoters;
    }

    mapping(address => Voter) private voters;

    Voter[] private votedFor;
    Voter[] private votedAgainst;
    // TODO: Experiment with LinkedList for voted lists, see if it can be cheaper.
//    LinkedList.LinkedList private votedVoters;

    function DelegationVoter(address voteTokenAddress){
        voteToken = MiniMeToken(voteTokenAddress);
    }

//    function hasVoted(address voterAddress) public constant returns (bool) { return voters[voterAddress].hasVoted; }

    function getVoter(address voterAddress) public constant returns (bool, bool, address, uint) {
        Voter voter = voters[voterAddress];
        return (voter.voteDirection, voter.hasVoted, voter.delegatedToVoter, voter.delegatedFromVoters.size);
    }

    function getDelegatedFromVotersNode(address voterAddress, address fromVoterAddress) public constant returns (uint, uint) {
        uint fromVoterNodeId = uint(fromVoterAddress);
        Voter voter = voters[voterAddress];
        LinkedList.Node delegatedFromVotersNode = voter.delegatedFromVoters.getNode(fromVoterNodeId);
        return (delegatedFromVotersNode.previousNode, delegatedFromVotersNode.nextNode);
    }

    function vote(bool _voteDirection) public { // true to vote for, false to vote against
        Voter storage voter = voters[msg.sender];
        voter.voteDirection = _voteDirection;
        voter.hasVoted = true;
    }

    function delegateVote(address delegateToAddress, uint previousNodeId) {
        uint delegatedFromListPosition = uint(delegateToAddress);
        address currentDelegatedToVoter = voter.delegatedToVoter;

        // Undelegate previous delegate
        if (currentDelegatedToVoter != 0) {
            voters[currentDelegatedToVoter].delegatedFromVoters.remove(delegatedFromListPosition);
        }

        // Update sender voter
        Voter storage voter = voters[msg.sender];
        voter.delegatedToVoter = delegateToAddress;
        if (voter.hasVoted) {
            voter.hasVoted = false;
        }

        // Update delegated to voter
        Voter storage delegatedVoter = voters[delegateToAddress];
        delegatedVoter.delegatedFromVoters.insert(previousNodeId, delegatedFromListPosition);
    }

    function getPreviousNodeIdForDelegate(address delegateToAddress) public constant returns (uint) {
        uint delegatedFromListPosition = uint(msg.sender);
        LinkedList.LinkedList delegatedFromVoters = voters[delegateToAddress].delegatedFromVoters;
        return delegatedFromVoters.getPreviousNodePosition(delegatedFromListPosition);
    }

    function calculateVotes() public constant returns (uint) {

    }
}
