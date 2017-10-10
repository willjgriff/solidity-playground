pragma solidity ^0.4.15;

import "./ContractInterface.sol";
import "../Resolver.sol";

contract ContractV2 is ContractInterface {

    Resolver public resolver;
    uint public storageValue;

    function testReturnValue() public constant returns (uint) {
        return 20;
    }

    function setStorageValue(uint value) {
        storageValue = value * 2;
    }

    function getStorageValue() public constant returns (uint) {
        return storageValue;
    }

}
