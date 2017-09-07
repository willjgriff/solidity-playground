pragma solidity ^0.4.13;

contract ERC23 {
    function transfer(address to, uint value, bytes data) returns (bool);
    function transferFrom(address from, address to, uint value, bytes data) returns (bool);
}
