pragma solidity ^0.4.13;

import "./ERC23.sol";
import "./ERC23Receiver.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract StandardERC23Token is ERC23, StandardToken {

    function StandardERC23Token(uint _totalSupply){
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
        uint length;
        assembly { length := extcodesize(accountAddress) }
        return length > 0;
    }

    function notifyContract(address from, address to, uint value, bytes data) private returns (bool) {
        ERC23Receiver receiverContract = ERC23Receiver(to);
        receiverContract.tokenFallback(from, value, data);
        return true;
    }
}
