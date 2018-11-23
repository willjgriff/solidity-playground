pragma solidity ^0.4.25;

contract ExternalContract {

    uint256 public _value;

    function updateValue(uint256 value) public {
        _value = value;
    }
}
