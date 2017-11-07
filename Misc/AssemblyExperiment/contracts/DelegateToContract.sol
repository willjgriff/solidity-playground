pragma solidity ^0.4.15;


contract DelegateToContract {

    function get32ByteValue() constant returns (uint256) {
        uint256 returnValue = 123;
        return returnValue;
    }
}
