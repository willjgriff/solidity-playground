pragma solidity ^0.5.1;

import "./helpers/ArrayLib.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

// Add events, will need for UI.
// Add error messages.
contract DelegationTree {

    using ArrayLib for address[];

    struct DelegateVoter {
        address delegateTo;

        // AscendingLinkedList vs Array.
        // With a linked list, insertion requires finding node position (previous node position) off chain and passing that in, deletion doesn't require anything off chain.
        // Insertion in a linked list requires storing 2 addresses and updating 2 addresses (of it's node and the node's it links to).
        // Deletion in a linked list requires 2 address deletions (gas refund?) and updating 2 addresses.
        //
        // With an Array, no off chain processing is required.
        // Insertion in an array requires storing 1 address plus the index in the array of that address (uint256) plus array overhead, at least updating length maybe more.
        // Deletion in an Array requires 1 address deletion (gas refund?) and 1 address update, plus updating length.
        uint delegatedFromAddressesIndex;
        address[] delegatedFrom;
    }

    mapping(address => DelegateVoter) public delegateVoters;

    function getDelegatedFromVotersForAddress(address _voter) public view returns (address[] memory) {
        return delegateVoters[_voter].delegatedFrom;
    }

    function getDelegateVoterToAddress(address _voter) public view returns (address) {
        return delegateVoters[_voter].delegateTo;
    }

    // Maybe shouldn't use msg.sender as this could be used by a contract
    // The longer the delegation chain, the more expensive checking for a circular delegation will be, what should be the limit?
    // Must check no current delegation, otherwise must undelegate first (to prevent issues in the delegatedFrom array)
    function delegateVote(address _delegateTo) public {
        require(_delegateTo != msg.sender, "Attempting to delegate to self");
        require(noncircularDelegation(_delegateTo), "Creates a circular delegation");

        DelegateVoter storage fromDelegateVoter = delegateVoters[msg.sender];
        DelegateVoter storage toDelegateVoter = delegateVoters[_delegateTo];

        fromDelegateVoter.delegateTo = _delegateTo;
        fromDelegateVoter.delegatedFromAddressesIndex = toDelegateVoter.delegatedFrom.length;
        toDelegateVoter.delegatedFrom.push(msg.sender);
    }

    function noncircularDelegation(address _delegateTo) private view returns (bool) {
        DelegateVoter storage delegateVoter = delegateVoters[_delegateTo];
        while (delegateVoter.delegateTo != address(0)) {
            if (delegateVoter.delegateTo == msg.sender) {
                return false;
            }
            delegateVoter = delegateVoters[delegateVoter.delegateTo];
        }
        return true;
    }

    function undelegateVote() public {
        DelegateVoter storage fromDelegateVoter = delegateVoters[msg.sender];
        uint256 removeIndex = fromDelegateVoter.delegatedFromAddressesIndex;

        DelegateVoter storage toDelegateVoter = delegateVoters[fromDelegateVoter.delegateTo];
        toDelegateVoter.delegatedFrom._removeElement(removeIndex);

        if (toDelegateVoter.delegatedFrom.length > 0) {
            address movedVoterAddress = toDelegateVoter.delegatedFrom[removeIndex];
            DelegateVoter storage movedDelegateVoter = delegateVoters[movedVoterAddress];
            movedDelegateVoter.delegatedFromAddressesIndex = removeIndex;
        }

        fromDelegateVoter.delegateTo = address(0);
    }

    // Recursive function limited by EVM stack depth, at least works for depth of 8
    function voteWeightOfAddress(address _address, IERC20 _token) public view returns (uint256) {
        uint256 totalWeight = 0;
        DelegateVoter storage voter = delegateVoters[_address];
        address[] storage voterDelegatedFrom = voter.delegatedFrom;

        for (uint256 i = 0; i < voterDelegatedFrom.length; i++) {
            totalWeight += voteWeightOfAddress(voterDelegatedFrom[i], _token);
        }

        totalWeight += _token.balanceOf(_address);
        return totalWeight;
    }
}
