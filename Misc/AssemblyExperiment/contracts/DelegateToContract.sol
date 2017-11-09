pragma solidity ^0.4.17;

// Don't use standard contracts as libraries, use the 'library' keyword instead. Parity multi-sig got locked because of this.
contract DelegateToContract {

    uint public updateByDelegate;

    function updateStorageVar() public {
        updateByDelegate = 321;
    }

    function get32ByteValue() public pure returns (uint256) {
        uint256 returnValue = 123;
        return returnValue;
    }
}
