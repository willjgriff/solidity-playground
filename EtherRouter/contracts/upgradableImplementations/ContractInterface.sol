pragma solidity ^0.4.15;

contract ContractInterface {

    function testReturnValue() public constant returns (uint);

    function setStorageValue(uint value);

    function getStorageValue() public constant returns (uint);
}
