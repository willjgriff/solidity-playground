pragma solidity ^0.4.11;

import "./ERC20.sol";

// This ERC20 token isn't necessary for the Futarchy contract. It may even harm the balance in voting.
// It is just for experimenting with ERC20 and communication between contracts.
contract VoteToken is ERC20 {

	// Internal by default (like protected in java)
	uint public totalSupply;
	mapping(address => uint) balances;
	mapping(address => mapping(address => uint)) allowances;

	string public constant name = "Vote Token";
	string public constant symbol = "VTE";
	uint8 public constant decimals = 18;

	// Note we do not return false in functions that fail, but throw instead.
	// I don't think there's consensus yet on which is better. Throw means we can use modifier's.
	modifier hasBalance(address account, uint value) {
		if (balances[account] < value) throw;
		_;
	}

	modifier hasAllowance(address from, address allowee, uint value) {
		if (allowances[from][allowee] < value) throw;
		_;
	}

	modifier wontOverflow(address account, uint value) {
		if (balances[account] + value < balances[account]) throw;
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

	function VoteToken(uint _totalSupply) {
		balances[msg.sender] = _totalSupply;
		totalSupply = _totalSupply;
	}

	function balanceOf(address who) constant returns (uint value) {
		return balances[who];
	}

	function allowance(address owner, address spender) constant returns (uint allowance) {
		return allowances[owner][spender];
	}

	function transfer(address to, uint value) 
		hasBalance(msg.sender, value) 
		wontOverflow(to, value)
		returns (bool ok) 
	{
		balances[msg.sender] -= value;
		balances[to] += value;
		Transfer(msg.sender, to, value);
		return true;
	}

	function transferFrom(address from, address to, uint value)
		hasBalance(from, value)
		hasAllowance(from, msg.sender, value)
		wontOverflow(to, value)
		returns (bool ok)
	{
		balances[from] -= value;
		allowances[from][msg.sender] -= value;
		balances[to] += value;
		Transfer(from, to, value);
		return true;
	}

	function approve(address spender, uint value) 
		allowanceSetToZero(spender, value)
		returns (bool ok)
	{
		allowances[msg.sender][spender] = value;
		Approval(msg.sender, spender, value);
		return true;
	}
}