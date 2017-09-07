pragma solidity ^0.4.13;

import "./ERC23.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract ERC23Token is ERC23, StandardToken {

    function ERC23Token(uint _totalSupply){
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function transfer(address to, uint value) public returns (bool) {
        transfer(to, value, new bytes(0));
    }

    function transfer(address to, uint value, bytes data) public returns (bool) {
        if (isContract(to)) revert();
        super.transfer(to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value, bytes data) public returns (bool) {

    }

    function isContract(address accountAddress) returns (bool) {
        uint length;
        assembly { length := extcodesize(accountAddress) }
        return length > 0;
    }
}
