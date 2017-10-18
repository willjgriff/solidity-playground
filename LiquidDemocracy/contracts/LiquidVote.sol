pragma solidity ^0.4.15;

import "./MiniMeToken.sol";

contract LiquidVote {

    MiniMeToken private voteToken;

    struct Voter {
        bool voteDirection;
        uint voteDirectionArrayPosition;
        bool hasVoted;

        address delegatedToVoter;
        uint delegatedToVoterArrayPosition;
        address[] delegatedFromVoters;
    }

    mapping(address => Voter) private voters;

    Voter[] private votedFor;
    Voter[] private votedAgainst;

    function DelegationVoter(address voteTokenAddress){
        voteToken = MiniMeToken(voteTokenAddress);
    }

//    function hasVoted(address voterAddress) public constant returns (bool) { return voters[voterAddress].hasVoted; }

    function getVoter(address voterAddress) public constant returns (bool, bool, address, uint) {
        Voter voter = voters[voterAddress];
        return (voter.voteDirection, voter.hasVoted, voter.delegatedToVoter, voter.delegatedFromVoters.length);
    }

    function getDelegatedFromVotersAddress(address voterAddress, uint position) public constant returns (address) {
        Voter delegatedVoter = voters[voterAddress];
        address[] delegatedFromVoters = delegatedVoter.delegatedFromVoters;
        return delegatedFromVoters[position];
    }

    function vote(bool _voteDirection) public { // true to vote for, false to vote against
        Voter storage voter = voters[msg.sender];
        voter.voteDirection = _voteDirection;
        voter.hasVoted = true;
//        if (_voteDirection) {
//            votedFor.
//        }
    }

    function delegateVote(address delegateToAddress) {
        Voter storage voter = voters[msg.sender];

        // Undelegate previous delegate
        address currentDelegatedToVoter = voter.delegatedToVoter;
        if (currentDelegatedToVoter != 0) {
            uint removalArrayPosition = voters[currentDelegatedToVoter].delegatedToVoterArrayPosition;
            // TODO: Remove from delegatedFromVoters
            voters[currentDelegatedToVoter].delegatedFromVoters;
        }

        // Update sender voter
        voter.delegatedToVoter = delegateToAddress;
        if (voter.hasVoted) {
            voter.hasVoted = false;
        }

        // Update delegated to voter
        Voter storage delegatedVoter = voters[delegateToAddress];
        delegatedVoter.delegatedFromVoters.push(msg.sender);
    }

    function calculateVotes() public constant returns (uint) {

    }
}
