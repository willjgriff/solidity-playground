pragma solidity ^0.4.13;


contract ERC223Receiver {
    function tokenFallback(address from, uint value, bytes data);
}
