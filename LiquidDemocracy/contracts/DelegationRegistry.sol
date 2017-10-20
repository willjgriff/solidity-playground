pragma solidity ^0.4.15;

import "./Helpers/ArrayLib.sol";
import "./MiniMeToken.sol";

// TODO: This needs to be copyable. Currently an account can vote and delegate their vote and both will be counted.
// If we use a copy of the DelegationRegistry for each Vote we can prevent voting if the account has delegated their vote.
// An account must then undelegate first (we can create a function that allows undelegating and voting to occur within a single tx).
contract DelegationRegistry {

    using ArrayLib for address[];

    struct DelegatedVoter {
        address toAddress;
        uint toAddressFromAddressesIndex;
        address[] fromAddresses;
    }

    mapping(address => DelegatedVoter) public delegatedVoters;

    function getDelegatedFromAddressesForVoter(address voterAddress) public constant returns (address[]) {
        return delegatedVoters[voterAddress].fromAddresses;
    }

    function getDelegatedVoterToAddress(address delegatedVoterAddress) public constant returns (address) {
        return delegatedVoters[delegatedVoterAddress].toAddress;
    }

    function delegateVote(address delegateToAddress) public {
        require(!createsCircularDelegation(delegateToAddress));

        DelegatedVoter storage delegateFromVoter = delegatedVoters[msg.sender];
        DelegatedVoter storage delegateToVoter = delegatedVoters[delegateToAddress];

        // Undelegate previous delegate
        address currentDelegatedToAddress = delegateFromVoter.toAddress;
        if (currentDelegatedToAddress != 0x0) {
            uint fromAddressesArrayIndex = delegatedVoters[currentDelegatedToAddress].toAddressFromAddressesIndex;
            delegatedVoters[currentDelegatedToAddress].fromAddresses.removeElement(fromAddressesArrayIndex);
        }

        // Update delegated from voter
        delegateFromVoter.toAddress = delegateToAddress;
        delegateFromVoter.toAddressFromAddressesIndex = delegateToVoter.fromAddresses.length;

        // Update delegated to voter
        delegateToVoter.fromAddresses.push(msg.sender);
    }

    // Checks for circular delegation when delegating from the sender's address
    // TODO: Also check for delegation chain limit, necessary to prevent going over stack limit during calculation, probably about 1000
    // Need to take into account the stack level the token can go to as well when doing balanceOf().
    function createsCircularDelegation(address delegateToAddress) public constant returns (bool) {
        DelegatedVoter storage delegateToVoter = delegatedVoters[delegateToAddress];
        while (delegateToVoter.toAddress != 0x0) {
            if (delegateToVoter.toAddress == msg.sender) return true;
            delegateToVoter = delegatedVoters[delegateToVoter.toAddress];
        }
        return false;
    }

    function undelegateVote(address delegatedVoterAddress) public {
        DelegatedVoter storage delegatedFromVoter = delegatedVoters[delegatedVoterAddress];
        DelegatedVoter storage delegatedToVoter = delegatedVoters[delegatedFromVoter.toAddress];

        delegatedFromVoter.toAddress = 0;
        delegatedToVoter.fromAddresses.removeElement(delegatedFromVoter.toAddressFromAddressesIndex);
    }

    function voteWeightOfAddress(address voterAddress, address voteTokenAddress) public constant returns (uint) {
        MiniMeToken voteToken = MiniMeToken(voteTokenAddress);
        DelegatedVoter storage delegatedVoter = delegatedVoters[voterAddress];
        uint voteWeight = voteToken.balanceOf(voterAddress);

        for (uint i = 0; i < delegatedVoter.fromAddresses.length; i++) {
            address delegatedFromVoter = delegatedVoter.fromAddresses[i];
            voteWeight += voteWeightOfAddress(delegatedFromVoter, voteToken);
        }

        return voteWeight;
    }
}
