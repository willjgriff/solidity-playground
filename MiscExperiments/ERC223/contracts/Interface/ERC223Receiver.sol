pragma solidity ^0.4.15;


contract ERC223Receiver {
    function tokenFallback(address originalCaller, address from, uint value, bytes data) returns (bool);
}
