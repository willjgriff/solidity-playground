pragma solidity ^0.4.13;

contract LibraryV2WithoutProxy {
    uint i;

    function getUint() returns (uint) {
        return i * 10;
    }

    function setUint(uint _i) {
        i = _i;
    }
}
