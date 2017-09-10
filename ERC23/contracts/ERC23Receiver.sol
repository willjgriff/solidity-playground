pragma solidity ^0.4.13;


contract ERC23Receiver {
    function tokenFallback(address from, uint value, bytes data);
}
