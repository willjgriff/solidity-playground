pragma solidity ^0.4.15;

import "./MiniMeToken.sol";
import "./ArrayLib.sol";

contract LiquidVote {

    using ArrayLib for address[];

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

    function getVoter(address voterAddress) public constant returns (bool, uint, bool, address, uint, uint) {
        Voter storage voter = voters[voterAddress];
        return (voter.voteDirection, voter.voteDirectionArrayPosition, voter.hasVoted, voter.delegatedToVoter, voter.delegatedToVoterArrayPosition, voter.delegatedFromVoters.length);
    }

    function getDelegatedFromVotersForVoter(address voterAddress) public constant returns (address[]) {
        return voters[voterAddress].delegatedFromVoters;
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
        require(!createsCircularDelegation(delegateToAddress));

        Voter storage voter = voters[msg.sender];
        Voter storage delegatedVoter = voters[delegateToAddress];

        // Undelegate previous delegate
        address currentDelegatedToVoter = voter.delegatedToVoter;
        if (currentDelegatedToVoter != 0) {
            uint removalArrayPosition = voters[currentDelegatedToVoter].delegatedToVoterArrayPosition;
            voters[currentDelegatedToVoter].delegatedFromVoters.removeElement(removalArrayPosition);
        }

        // Update delegated to voter
        delegatedVoter.delegatedFromVoters.push(msg.sender);

        // Update sender voter
        voter.delegatedToVoter = delegateToAddress;
        voter.delegatedToVoterArrayPosition = delegatedVoter.delegatedFromVoters.length - 1;
        if (voter.hasVoted) {
            voter.hasVoted = false;
        }
    }

    // Checks for circular delegation when delegating from the sender's address
    function createsCircularDelegation(address delegateToAddress) public constant returns (bool) {
        Voter storage delegatedToVoter = voters[delegateToAddress];
        while (delegatedToVoter.delegatedToVoter != 0x0) {
            if (delegatedToVoter.delegatedToVoter == msg.sender) return true;
            delegatedToVoter = voters[delegatedToVoter.delegatedToVoter];
        }
        return false;
    }

    function calculateVotes() public constant returns (uint) {

    }
}
