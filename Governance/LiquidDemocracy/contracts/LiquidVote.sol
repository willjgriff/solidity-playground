pragma solidity ^0.4.15;

import "./MiniMeToken.sol";
import "./Helpers/ArrayLib.sol";
import "./DelegationRegistry.sol";

// TODO: Split into a delegation registry and a vote contract. Enable Topics somehow...
// Delegation registry should probably be copied for each new vote. So delegations can change for each specific vote.
contract LiquidVote {

    using ArrayLib for address[];

    MiniMeToken private voteToken;
    DelegationRegistry private delegationRegistry;

    struct Voter {
        bool voteDirection;
        uint voteDirectionArrayPosition;
        bool hasVoted;
    }

    mapping(address => Voter) public voters;

    address[] public votedFor;
    address[] public votedAgainst;

    function LiquidVote(address voteTokenAddress, address delegationRegistryAddress){
        voteToken = MiniMeToken(voteTokenAddress);
        delegationRegistry = DelegationRegistry(delegationRegistryAddress);
    }

//    function hasVoted(address voterAddress) public constant returns (bool) { return voters[voterAddress].hasVoted; }

    function getVotedForAddresses() public constant returns (address[]) {
        return votedFor;
    }

    function getVotedAgainstAddresses() public constant returns (address[]) {
        return votedAgainst;
    }

    function hasDelegatedVote(address voter) public constant returns (bool) {
        address delegatedVoterAddress = delegationRegistry.getDelegatedVoterToAddress(voter);
        return delegatedVoterAddress != 0x0;
    }

    // TODO: Must prevent voting if currently delegated, must remove delegation first.
    function vote(bool _voteDirection) public { // true to vote for, false to vote against
        require(!hasDelegatedVote(msg.sender));

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

    function calculateVotes() public constant returns (uint) {

    }
}
