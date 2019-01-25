pragma solidity ^0.4.15;

import "./Helpers/ArrayLib.sol";
import "./MiniMeToken.sol";

// I have attempted to make this DelegationRegistry copyable by having it accept a parent delegation registry in the constructor.
// It turns out it's quite hard to compare tree's of delegations where the parent structure is adhered to if and only
// if the child structure at each node hasn't been changed, and the child structure is adhered to where it is different to the parent.
// The difficulty is mainly because links can be created in the child that the parent knows nothing of.
// This has led me to the recursive mess that can be seen in the final few functions of this contract. Note some of the functionality works
// as can be seen by running the tests.

// Note that all the contracts and tests here are unfinished and require function docs and refactoring to increase readability.
contract DelegationRegistry {

    using ArrayLib for address[];

    struct DelegatedVoter {
        address toAddress;
        // The index of this DelegatedVoters address in the fromAddresses array of the toAddress DelegatedVoter
        uint toAddressFromAddressesIndex;
        // This array should be a linked list, then I think we can get rid of the above uint
        address[] fromAddresses;
        // Maybe can be replaced with block number
        bool ignoreParentRegistry;
    }

    DelegationRegistry parentRegistry;
    mapping(address => DelegatedVoter) public delegatedVoters;

    function DelegationRegistry(address parentDelegationRegistryAddress) {
        parentRegistry = DelegationRegistry(parentDelegationRegistryAddress);
    }

    function getDelegatedFromAddressesForVoter(address voterAddress) public constant returns (address[]) {
        return delegatedVoters[voterAddress].fromAddresses;
    }

    function getDelegatedVoterToAddress(address delegatedVoterAddress) public constant returns (address) {
        return delegatedVoters[delegatedVoterAddress].toAddress;
    }

    // TODO: Can this and the above be merged somehow?
    function shouldIgnoreParent(address delegatedVoterAddress) public constant returns (bool) {
        return delegatedVoters[delegatedVoterAddress].ignoreParentRegistry;
    }

    function delegateVote(address delegateToAddress) public {
        require(!createsCircularDelegation(delegateToAddress));

        DelegatedVoter storage delegatedFromVoter = delegatedVoters[msg.sender];
        DelegatedVoter storage delegatedToVoter = delegatedVoters[delegateToAddress];

        // Undelegate previously delegated to delegate voter
        address currentDelegatedToAddress = delegatedFromVoter.toAddress;
        removeDelegatedVoterAndUpdateIndex(delegatedFromVoter, currentDelegatedToAddress);

        // Update delegated from voter
        delegatedFromVoter.toAddress = delegateToAddress;
        delegatedFromVoter.toAddressFromAddressesIndex = delegatedToVoter.fromAddresses.length;
        // TODO: Test the below.
        if (delegatedFromVoter.ignoreParentRegistry == false) {
            delegatedFromVoter.ignoreParentRegistry = true;
        }

        // Update new delegated to voter
        delegatedToVoter.fromAddresses.push(msg.sender);
    }

    // Checks for circular delegation when delegating from the sender's address
    // TODO: Also check for delegation chain limit, necessary to prevent going over stack limit during calculation, probably about 1000
    // Need to take into account the stack level the token can go to as well as the parent registry when doing balanceOf() though.
    function createsCircularDelegation(address delegateToAddress) public constant returns (bool) {
        DelegatedVoter storage delegateToVoter = delegatedVoters[delegateToAddress];
        while (delegateToVoter.toAddress != 0x0) {
            if (delegateToVoter.toAddress == msg.sender) return true;
            delegateToVoter = delegatedVoters[delegateToVoter.toAddress];
        }
        return false;
    }

    function undelegateVote() public {
        DelegatedVoter storage delegatedFromVoter = delegatedVoters[msg.sender];
        removeDelegatedVoterAndUpdateIndex(delegatedFromVoter, delegatedFromVoter.toAddress);
        delegatedFromVoter.toAddress = 0x0;
        // TODO: Test the below
        if (delegatedFromVoter.ignoreParentRegistry == false) {
            delegatedFromVoter.ignoreParentRegistry = true;
        }
    }

    function removeDelegatedVoterAndUpdateIndex(DelegatedVoter storage delegatedFromVoter, address delegatedToVoterAddress) private {
        if (delegatedToVoterAddress != 0x0) {
            DelegatedVoter storage delegatedToVoter = delegatedVoters[delegatedToVoterAddress];
            address[] storage fromAddresses = delegatedToVoter.fromAddresses;
            address lastAddressInFromAddresses = fromAddresses[fromAddresses.length - 1];
            DelegatedVoter storage lastDelegatedVoterInFromAddresses = delegatedVoters[lastAddressInFromAddresses];

            lastDelegatedVoterInFromAddresses.toAddressFromAddressesIndex = delegatedFromVoter.toAddressFromAddressesIndex;
            fromAddresses.removeElement(delegatedFromVoter.toAddressFromAddressesIndex);
        }
    }

    function voteWeightOfAddress(address voterAddress, address voteTokenAddress) public constant returns (uint) {
        return voteWeightOfAddressWithChildRegistry(voterAddress, voteTokenAddress, 0);
    }

    // TODO: we shouldn't use inner functions as it will reduce the delegation levels available, less readability...
    function voteWeightOfAddressWithChildRegistry(address voterAddress, address voteTokenAddress, address childRegistryAddress) public constant returns (uint) {
        uint voteWeight;
        MiniMeToken voteToken = MiniMeToken(voteTokenAddress);

        voteWeight += voteWeightOfDelegatedFrom(voterAddress, voteToken, childRegistryAddress);

        if (isRootRegistry()) {
            voteWeight += voteToken.balanceOf(voterAddress);
        } else {
            voteWeight += parentRegistry.voteWeightOfAddressWithChildRegistry(voterAddress, voteTokenAddress, this);
        }

        return voteWeight;
    }

    function voteWeightOfDelegatedFrom(address voterAddress, MiniMeToken voteToken, address childRegistryAddress) private constant returns (uint) {

        DelegatedVoter storage delegatedVoter = delegatedVoters[voterAddress];
        DelegationRegistry childDelegationRegistry = DelegationRegistry(childRegistryAddress);
        uint voteWeight;
        address delegatedFromAddress;

        if (childRegistryAddress == 0x0) {
            for (uint i = 0; i < delegatedVoter.fromAddresses.length; i++) {
                delegatedFromAddress = delegatedVoter.fromAddresses[i];
                voteWeight += voteWeightOfAddressWithChildRegistry(delegatedFromAddress, voteToken, 0x0);
            }

        } else if (!childDelegationRegistry.shouldIgnoreParent(voterAddress)) {
            for (uint j = 0; j < delegatedVoter.fromAddresses.length; j++) {
                delegatedFromAddress = delegatedVoter.fromAddresses[j];

                if (!childDelegationRegistry.shouldIgnoreParent(delegatedFromAddress)
//                    || childDelegationRegistry.getDelegatedVoterToAddress(delegatedFromAddress) == voterAddress
                ) {

                    voteWeight += voteWeightOfAddressWithChildRegistry(delegatedFromAddress, voteToken, childRegistryAddress);
                }
            }
        }
        return voteWeight;
    }

    function isRootRegistry() private returns (bool) {
        return address(parentRegistry) == 0x0;
    }
}
