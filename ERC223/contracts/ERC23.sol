pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/token/ERC20.sol";

contract ERC23 is ERC20 {
    function transfer(address to, uint value, bytes data) returns (bool);
    function transferFrom(address from, address to, uint value, bytes data) returns (bool);
}
