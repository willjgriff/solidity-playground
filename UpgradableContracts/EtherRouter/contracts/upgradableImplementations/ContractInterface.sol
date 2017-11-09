pragma solidity ^0.4.15;

contract ContractInterface {

    function returnValue() public constant returns (uint);

    function setStorageValue(uint value) public;
    function getStorageValue() public constant returns (uint);

    function setDynamicallySizedValue(string dynamicValue) public;
    function getDynamicallySizedValue() public constant returns (string);
    function getDynamicallySizedValueSize() public constant returns (uint);
}
