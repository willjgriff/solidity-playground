pragma solidity ^0.4.13;

import "./ERC223.sol";
import "./ERC223Receiver.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract StandardERC223Token is ERC223, StandardToken {

    function StandardERC223Token(uint _totalSupply){
        totalSupply = _totalSupply;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint value) public returns (bool) {
        transfer(to, value, new bytes(0));
    }

    function transfer(address to, uint value, bytes data) public returns (bool) {
        if (isContract(to)) notifyContract(msg.sender, to, value, data);
        super.transfer(to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) public returns (bool) {
        transferFrom(from, to, value, new bytes(0));
    }

    function transferFrom(address from, address to, uint value, bytes data) public returns (bool) {
        if (isContract(to)) notifyContract(from, to, value, data);
        super.transferFrom(from, to, value);
        return true;
    }

    function isContract(address accountAddress) private returns (bool) {
        uint accountCodeSize;
        assembly { accountCodeSize := extcodesize(accountAddress) }
        return accountCodeSize > 0;
    }

    function notifyContract(address from, address to, uint value, bytes data) private returns (bool) {
        ERC223Receiver receiverContract = ERC223Receiver(to);
        receiverContract.tokenFallback(from, value, data);
        return true;
    }
}
