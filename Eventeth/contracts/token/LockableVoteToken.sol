pragma solidity ^0.4.11;

import "./ERC20Token.sol";
import "../vote/Votes.sol";
import "../vote/unrevealedLockTimes/LinkedList.sol";

// Basic ERC20 Token which locks transfers and stores incoming transfers until accounts are 
// unlocked. Accounts are locked if votes.voterEarliestTokenLockTime(msg.sender) is past now.
// In which case the account needs to reveal any unrevealed votes.
contract LockableVoteToken is ERC20Token {
    
    string public constant name = "Vote Token";
	string public constant symbol = "VTE";
	uint8 public constant decimals = 18;
    
    struct TokenHolder {
        uint balance;
        uint lockedBalance;
    }

	uint public totalSupply;
	mapping(address => TokenHolder) tokenHolders;
	mapping(address => mapping(address => uint)) allowances;
	
	Votes votes;

	modifier hasBalance(address account, uint value) {
		if (tokenHolders[account].balance < value) throw;
		_;
	}

	modifier hasAllowance(address from, address allowee, uint value) {
		if (allowances[from][allowee] < value) throw;
		_;
	}

	modifier wontOverflow(address account, uint value) {
		if (tokenHolders[account].balance + value < tokenHolders[account].balance) throw;
		_;
	}

	modifier allowanceSetToZero(address spender, uint value) {
		// Safeguard copied from OpenZeppelin. Still doesn't prevent the approved address from initiating
		// a race condition to extract the currently approved value when tranferFrom tx is in the same block.
		// But does prevent them from sneakily extracting current approved amount and newly approved amount.

		// To change the approve amount you first have to reduce the addresses`
		// allowance to zero by calling `approve(_spender, 0)` if it is not
		// already 0 to mitigate the race condition described here:
		// https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
		if (value != 0 && allowances[msg.sender][spender] != 0) throw;
		_;
	}
	
	modifier sendersAccountUnlocked(address sender) {
	    if (!accountUnlocked(msg.sender)) throw;
	    _;
	}

	modifier onlyVotesContract() {
	    if (msg.sender != address(votes)) throw;
	    _;
	}

	function LockableVoteToken(uint _totalSupply, Votes _votes) {
	   // _totalSupply *= 10**uint(decimals);
		tokenHolders[msg.sender].balance = _totalSupply;
		totalSupply = _totalSupply;
		votes = _votes;
	}

	function balanceOf(address who) constant returns (uint value) {
		return tokenHolders[who].balance;
	}

	function totalBalanceOf(address who) constant returns (uint value) {
		return tokenHolders[who].balance + tokenHolders[who].lockedBalance;
	}

	function allowance(address owner, address spender) constant returns (uint allowance) {
		return allowances[owner][spender];
	}

	function transfer(address to, uint value) returns (bool) {
        moveFunds(msg.sender, to, value);
		return true;
	}

	function transferFrom(address from, address to, uint value)
		hasAllowance(from, msg.sender, value)
		returns (bool)
	{
	    allowances[from][msg.sender] -= value;
	    moveFunds(from, to, value);
		return true;
	}

	function moveFunds(address from, address to, uint value) private
	    hasBalance(from, value) 
	    wontOverflow(to, value)
	    sendersAccountUnlocked(from)
	{
		tokenHolders[from].balance -= value;
	    if (accountUnlocked(to)) {
	        tokenHolders[to].balance += value;
	    } else {
	        tokenHolders[to].lockedBalance += value;
	    }
	    Transfer(from, to, value);
	}

	/**
	 * @dev Requires setting the allowance to 0 before it can be changed.
	 */
	function approve(address spender, uint value) 
		allowanceSetToZero(spender, value)
		returns (bool)
	{
		allowances[msg.sender][spender] = value;
		Approval(msg.sender, spender, value);
		return true;
	}
	
	function updateUnlockedBalance(address account)
	    onlyVotesContract 
	{
	    tokenHolders[account].balance += tokenHolders[account].lockedBalance;
	    tokenHolders[account].lockedBalance = 0;
	}
	
	function accountUnlocked(address account) private returns (bool) {
	    if (votes.voterEarliestTokenLockTime(account) != LinkedList.headTailIndex() && votes.voterEarliestTokenLockTime(account) < now) return false;
	    return true;
	}
	
}