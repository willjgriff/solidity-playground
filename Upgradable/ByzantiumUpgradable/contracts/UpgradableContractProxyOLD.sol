pragma solidity ^0.4.18;

// TODO: Should be ownable, by some multi-sig / dao.
contract UpgradableContractProxy {

    address private upgradableContractAddress;

    function UpgradableContractProxy(address initialContractAddress) public {
        upgradableContractAddress = initialContractAddress;
    }

    function setContractAddress(address newContractAddress) public {
        upgradableContractAddress = newContractAddress;
    }

    // Copied mainly from a message in the Solidity gitter
    function () public {

        // Could load this using assembly, although I think it's clearer when using standard Solidity
        address upgradableContractMem = upgradableContractAddress;

        // Should test if we can get the calldata somehow without using assembly, perhaps with msg.data
        assembly {
            let freeMemAddress := mload(0x40)
            // mstore(memAddress, value)
            mstore(0x40, add(freeMemAddress, calldatasize))
            // calldatacopy(toMemAddress, fromMemAddress, sizeInBytes)
            calldatacopy(freeMemAddress, 0x0, calldatasize)

            // delegatecall(gasAllowed, callAddress, inMemAddress, inSizeBytes, outMemAddress, outSizeBytes) returns/pushes to stack (1 on success, 0 on failure)
            switch delegatecall(gas, upgradableContractMem, freeMemAddress, calldatasize, 0, 0)
                // revert(fromMemAddress, sizeInBytes) ends execution and returns value
                case 0 { revert(0x0, 0) }
                default {
                    // returndatacopy(toMemAddress, fromMemAddress, sizeInBytes)
                    returndatacopy(0x0, 0x0, returndatasize)
                    // return(fromMemAddress, sizeInBytes)
                    return(0x0, returndatasize)
            }
        }
    }
}