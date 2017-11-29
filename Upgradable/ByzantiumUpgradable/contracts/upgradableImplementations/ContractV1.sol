pragma solidity ^0.4.18;

import "./ContractInterface.sol";

contract ContractV1 is ContractInterface {

    // Stored data actually lives in the UpgradableContractProxy. However the storage layout is specified here in the implementing contracts.
    // The first variable in the UpgradableContractProxy is a reference to the address of this contract, the second is the owner, from the inherited Ownable.sol.
    // Therefore the first and second references in each contract using the UpgradableContractProxy must be set aside for these addresses.
    address private upgradableContractAddress;
    address public owner;

    // The storage layout must remain the same in all the upgraded contracts, although it can be added to.
    // Note that besides the potential mess of unnecessary variables this could create over time, there isn't currently
    // any increase in cost because of this.
    uint public storageValue;
    string public dynamicallySizedValue;

    function returnValue() public constant returns (uint) {
        return 10;
    }

    function setStorageValue(uint value) public {
        storageValue = value;
    }

    // We can't use the automatically created getter methods for public vars if
    // we want them to be updatable because we can't specify them in an interface.
    function getStorageValue() public constant returns (uint) {
        return storageValue;
    }

    function setDynamicallySizedValue(string dynamicValue) public {
        dynamicallySizedValue = dynamicValue;
    }

    function getDynamicallySizedValue() public constant returns (string) {
        return dynamicallySizedValue;
    }

}
