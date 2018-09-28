pragma solidity ^0.4.15;

import "../Interface/ERC223.sol";
import "../Interface/ERC223Receiver.sol";
import "zeppelin-solidity/contracts/token/StandardToken.sol";

/**
 * @notice Currently proposed standard implementation of ERC223 Token.
 *         Differences to ERC20:
 *         Checks if the receiver is a contract address during tx's and if so checks it can handle the funds.
 *         Allows submitting of encoded function calls to the receiving address if it's a contract. Removing
 *         the need to execute multiple transactions for each of the token and receiving contract.
 */
contract StandardERC223Token is ERC223, StandardToken {

    function StandardERC223Token(uint _totalSupply){
        totalSupply = _totalSupply;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint value) public returns (bool) {
        transfer(to, value, new bytes(0));
    }

    function transfer(address to, uint value, bytes data) public returns (bool) {
        super.transfer(to, value);
        if (isContract(to)) notifyContractOrFail(msg.sender, to, value, data);
        return true;
    }

    function transferFrom(address from, address to, uint value) public returns (bool) {
        transferFrom(from, to, value, new bytes(0));
    }

    function transferFrom(address from, address to, uint value, bytes data) public returns (bool) {
        super.transferFrom(from, to, value);
        if (isContract(to)) return notifyContractOrFail(from, to, value, data);
        return true;
    }

    function isContract(address accountAddress) private returns (bool) {
        uint accountCodeSize;
        assembly { accountCodeSize := extcodesize(accountAddress) }
        return accountCodeSize > 0;
    }

    function notifyContractOrFail(address from, address to, uint value, bytes data) private returns (bool) {
        ERC223Receiver receiverContract = ERC223Receiver(to);
        receiverContract.tokenFallback(msg.sender, from, value, data);
        return true;
    }
}
