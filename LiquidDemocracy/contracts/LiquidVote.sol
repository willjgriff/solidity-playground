pragma solidity ^0.4.15;

import "./MiniMeToken.sol";
import "./ArrayLib.sol";

// TODO: Split into a delegation registry and a vote contract. Enable Topics somehow...
// Delegation registry should probably be copied for each new vote. So delegations can change for each specific vote.
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

    mapping(address => Voter) public voters;

    address[] public votedFor;
    address[] public votedAgainst;

    function LiquidVote(address voteTokenAddress){
        voteToken = MiniMeToken(voteTokenAddress);
    }

//    function hasVoted(address voterAddress) public constant returns (bool) { return voters[voterAddress].hasVoted; }

    function getDelegatedFromVotersForVoter(address voterAddress) public constant returns (address[]) {
        return voters[voterAddress].delegatedFromVoters;
    }

    function getVotedForAddresses() public constant returns (address[]) {
        return votedFor;
    }

    function getVotedAgainstAddresses() public constant returns (address[]) {
        return votedAgainst;
    }

    // TODO: Must prevent voting if currently delegated, must remove delegation first.
    function vote(bool _voteDirection) public { // true to vote for, false to vote against
        Voter storage voter = voters[msg.sender];

        if (voter.hasVoted) {
            if (voter.voteDirection == _voteDirection) { revert(); }
            voter.voteDirection
                ? votedFor.removeElement(voter.voteDirectionArrayPosition)
                : votedAgainst.removeElement(voter.voteDirectionArrayPosition);
        } else {
            voter.hasVoted = true;
            voter.voteDirection = _voteDirection;
        }

        if (_voteDirection) {
            voter.voteDirectionArrayPosition = votedFor.length;
            votedFor.push(msg.sender);
        } else {
            voter.voteDirectionArrayPosition = votedAgainst.length;
            votedAgainst.push(msg.sender);
        }
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

        // Update sender voter
        // TODO: This stuff needs abstracted into a separate contract, delegation should be separate to voting.
        voter.delegatedToVoter = delegateToAddress;
        voter.delegatedToVoterArrayPosition = delegatedVoter.delegatedFromVoters.length;
        if (voter.hasVoted) {
            voter.hasVoted = false;
            // TODO: The below has not been unit tested as it will probably be removed / abstracted somehow.
            voter.voteDirection
            ? votedFor.removeElement(voter.voteDirectionArrayPosition)
            : votedAgainst.removeElement(voter.voteDirectionArrayPosition);
        }

        // Update delegated to voter
        delegatedVoter.delegatedFromVoters.push(msg.sender);
    }

    // Checks for circular delegation when delegating from the sender's address
    // TODO: Also check for delegation chain limit, necessary to prevent going over stack limit during calculation, probably about 1000
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

    function voteWeightOfAddress(address voterAddress) public constant returns (uint) {
        Voter storage voter = voters[voterAddress];
        uint voteWeight = voteToken.balanceOf(voterAddress);

        for (uint i = 0; i < voter.delegatedFromVoters.length; i++) {
            address delegatedFromVoter = voter.delegatedFromVoters[i];
            voteWeight += voteWeightOfAddress(delegatedFromVoter);
        }

        return voteWeight;
    }
}
