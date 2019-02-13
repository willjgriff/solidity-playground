pragma solidity ^0.4.24;

import "./DelegationTree.sol";
import "./VoteToken.sol";

// Ideally we would use the Voting app, however the total vote weight calculation can only be called as an external view function.
// This is due to it's likely high cost of execution, outside the range of the block gas limit. The Voting app assumes this can be
// executed on chain. Although you can't use the result on chain, end users can still see the result and use it to inform decisions.

// Requires the use of either the MiniMeToken with checkpointing or evm-storage-proofs as outlined here: https://github.com/aragon/evm-storage-proofs
// to lock the current balances of a token at a particular block, for use in calculating the total. If using the evm-storage-proofs, proofs must be
// submitted and verified when a voter creates a delegation and the root voter must submit a proof when voting.
contract DelegatedVote {

    using ArrayLib for address[];

    VoteToken public voteToken;
    DelegationTree public delegationTree;
    mapping(address => Voter) public voters;
    address[] public votedFor;
    address[] public votedAgainst;

    struct Voter {
        bool inFavour;
        uint voteArrayPosition;
        bool hasVoted;
    }

    constructor(VoteToken _voteToken, DelegationTree _delegationTree) public {
        voteToken = VoteToken(_voteToken);
        delegationTree = DelegationTree(_delegationTree);
    }

    function votedInFavour(address voter) public view returns (bool) {
        return voters[voter].inFavour;
    }

    function getVotedForAddresses() public view returns (address[] memory) {
        return votedFor;
    }

    function getVotedAgainstAddresses() public view returns (address[] memory) {
        return votedAgainst;
    }

    function undelegatedVoter(address voter) public view returns (bool) {
        address delegateVoterAddress = delegationTree.getDelegateVoterToAddress(voter);
        return delegateVoterAddress == address(0);
    }

    function vote(bool _inFavour) public {
        Voter storage voter = voters[msg.sender];

        require(undelegatedVoter(msg.sender), "Voter must not have delegated their vote");
        require(!(voter.hasVoted && voter.inFavour == _inFavour), "Already voted in this direction");

        if (voter.hasVoted) {
            if (voter.inFavour) {
                votedFor._removeElement(voter.voteArrayPosition);
                _updateVoteArrayAndIndices(votedFor, voter.voteArrayPosition);
            } else {
                votedAgainst._removeElement(voter.voteArrayPosition);
                _updateVoteArrayAndIndices(votedAgainst, voter.voteArrayPosition);
            }
        } else {
            voter.hasVoted = true;
            voter.inFavour = _inFavour;
        }

        if (_inFavour) {
            voter.voteArrayPosition = votedFor.length;
            votedFor.push(msg.sender);
        } else {
            voter.voteArrayPosition = votedAgainst.length;
            votedAgainst.push(msg.sender);
        }
    }

    function _updateVoteArrayAndIndices(address[] memory voteArray, uint256 voteArrayPosition) private {
        if (voteArray.length > 0) {
            address movedVoterAddress = voteArray[voteArrayPosition];
            Voter storage movedVoter = voters[movedVoterAddress];
            movedVoter.voteArrayPosition = voteArrayPosition;
        }
    }

    function totalVotedFor() public view returns (uint) {
        return _totalVotedWeight(votedFor);
    }

    function totalVotedAgainst() public view returns (uint) {
        return _totalVotedWeight(votedAgainst);
    }

    function _totalVotedWeight(address[] memory voteArray) private view returns (uint) {
        uint256 totalWeight = 0;

        for (uint256 i = 0; i < voteArray.length; i++) {
            totalWeight += delegationTree.voteWeightOfAddress(voteArray[i], voteToken);
        }
        return totalWeight;
    }
}
