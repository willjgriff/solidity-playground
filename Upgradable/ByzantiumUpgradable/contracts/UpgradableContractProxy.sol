pragma solidity ^0.4.18;

import "./Ownable.sol";

/**
 * Note this contract holds the storage the upgradable contracts will use.
 * Calling the contract's implementations directly will not effect this contracts storage and should have
 * no effect on the expected behaviour when properly using the upgradable contract through this proxy.
 */
contract UpgradableContractProxy is Ownable {

    // Contracts at the upgradableContractAddress must reserve the first location in storage for this address as
    // they will be called through this contract. This contract masquerades as the implementation to create a common
    // location for storage of vars.
    address private upgradableContractAddress;

    function UpgradableContractProxy(address initialContractAddress) public {
        upgradableContractAddress = initialContractAddress;
    }

    function setContractAddress(address newContractAddress) public onlyOwner {
        upgradableContractAddress = newContractAddress;
    }

    function () public {

        bool callSuccess = upgradableContractAddress.delegatecall(msg.data);

        if (callSuccess) {
            assembly {
                // returndatacopy(toMemAddress, fromMemAddress, sizeInBytes)
                returndatacopy(0x0, 0x0, returndatasize)
                // return(fromMemAddress, sizeInBytes)
                return(0x0, returndatasize)
            }
        } else {
            revert();
        }
    }
}
