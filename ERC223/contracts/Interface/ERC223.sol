pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/token/ERC20.sol";

contract ERC223 is ERC20 {
    function transfer(address to, uint value, bytes data) returns (bool);
    function transferFrom(address from, address to, uint value, bytes data) returns (bool);
}
