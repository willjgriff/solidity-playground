pragma solidity ^0.4.0;


contract FallbackFuncContract {

    uint public someNumber;

    event LogDebug(uint loggedNumber);

    function FallbackFuncContract(uint _someNumber) {
        someNumber = _someNumber;
    }

    function() {
        someNumber += 5;
        LogDebug(someNumber);
    }
}
