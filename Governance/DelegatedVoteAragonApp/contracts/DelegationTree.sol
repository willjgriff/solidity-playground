pragma solidity ^0.5.1;

import "./ArrayLib.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract DelegationTree {

    using ArrayLib for address[];

    struct DelegateVoter {
        address delegateTo;

        // AscendingLinkedList vs Array.
        // With a linked list, insertion requires finding node position (previous node position) off chain and passing that in, deletion doesn't require anything off chain.
        // Insertion in a linked list requires storing 2 addresses and updating 2 addresses, deletion in a linked list requires 2 address deletions (gas refund?) and updating 2 addresses.
        //
        // With an Array, no off chain processing is required.
        // Insertion in an array requires storing 1 address plus the index in the array of that address plus array overhead, atleast updating length maybe more.
        // Deletion in an Array requires 1 address deletion (gas refund?) and 1 address update, plus updating length.
        uint delegatedFromAddressesIndex;
        address[] delegatedFrom;
    }

    mapping(address => DelegateVoter) public delegateVoters;

    function getDelegatedFromVotersForAddress(address _address) public view returns (address[] memory) {
        return delegateVoters[_address].delegatedFrom;
    }

    // Shouldn't use msg.sender as this could be used by a contract
    function delegateVote(address _delegateTo) public {
        require(noncircularDelegation(_delegateTo));

        delegateVoters[msg.sender].delegateTo = _delegateTo;
        delegateVoters[_delegateTo].delegatedFrom.push(msg.sender);
    }

    function noncircularDelegation(address _delegateTo) internal view returns (bool) {
        if (_delegateTo == msg.sender) { return false; }

        DelegateVoter storage delegateVoter = delegateVoters[_delegateTo];
        while (delegateVoter.delegateTo != address(0)) {
            if (delegateVoter.delegateTo == msg.sender) { return false; }
            delegateVoter = delegateVoters[delegateVoter.delegateTo];
        }

        return true;
    }

    function undelegateVote() public {
        DelegateVoter storage delegateVoter = delegateVoters[msg.sender];
        DelegateVoter storage delegateToVoter = delegateVoters[delegateVoter.delegateTo];

        delegateVoter.delegateTo = address(0);
//        delegateToVoter.delegatedFrom
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
