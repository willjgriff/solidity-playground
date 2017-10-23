pragma solidity ^0.4.15;

import "./Helpers/ArrayLib.sol";
import "./MiniMeToken.sol";

// TODO: This needs to be copyable. Currently an account can vote and delegate their vote and both will be counted.
// If we use a copy of the DelegationRegistry for each Vote we can prevent voting if the account has delegated their vote.
// An account must then undelegate before voting (we can create a function that allows undelegating and voting to occur within a single tx).
// Also all contracts need more comments.
contract DelegationRegistry {

    using ArrayLib for address[];

    struct DelegatedVoter {
        address toAddress;
        uint toAddressFromAddressesIndex;
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

    // TODO: Is it a problem this is public?
    // Also we shouldn't use inner functions as it will reduce the delegation levels available, less readability...
    function voteWeightOfAddressWithChildRegistry(address voterAddress, address voteTokenAddress, address childRegistryAddress) public constant returns (uint) {
        if (isRootRegistry()) {
            return calculateWeightOfAddress(voterAddress, voteTokenAddress, childRegistryAddress);
        } else {
            return parentRegistry.voteWeightOfAddressWithChildRegistry(voterAddress, voteTokenAddress, this);
        }
    }

    function calculateWeightOfAddress(address voterAddress, address voteTokenAddress, address childRegistryAddress) private constant returns (uint) {

        DelegatedVoter storage delegatedVoter = delegatedVoters[voterAddress];
        MiniMeToken voteToken = MiniMeToken(voteTokenAddress);
        uint voteWeight = voteToken.balanceOf(voterAddress);

        for (uint i = 0; i < delegatedVoter.fromAddresses.length; i++) {

            address delegatedFromAddress = delegatedVoter.fromAddresses[i];

            if (childRegistryAddress == 0x0) {
                voteWeight += voteWeightOfAddressWithChildRegistry(delegatedFromAddress, voteToken, 0x0);
            } else {
                DelegationRegistry childDelegationRegistry = DelegationRegistry(childRegistryAddress);
                if (!childDelegationRegistry.shouldIgnoreParent(delegatedFromAddress) ||
                    childDelegationRegistry.getDelegatedVoterToAddress(delegatedFromAddress) == voterAddress) {

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
