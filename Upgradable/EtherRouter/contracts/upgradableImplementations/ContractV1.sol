pragma solidity ^0.4.15;

import "./ContractInterface.sol";
import "../Resolver.sol";

contract ContractV1 is ContractInterface {

    // Stored data lives in the EtherRouter. The first and only variable in the Ether router is a reference to the Resolver.
    // Therefore the first reference in each contract using the EtherRouter must be set aside for the resolver.
    // The current storage layout must remain the same in all the upgraded contracts, although it can be added to.
    // Note that besides the potential mess of unnecessary variables this could create over time, there isn't currently
    // any increase in cost because of this.
    Resolver public resolver;
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

    function getDynamicallySizedValueSize() public constant returns (uint) {
        return bytes(dynamicallySizedValue).length;
    }

}
