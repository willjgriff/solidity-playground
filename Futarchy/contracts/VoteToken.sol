pragma solidity ^0.4.11;

import "./ERC20.sol";

// This ERC20 token isn't necessary for the Voting contract. It may even harm the balance in voting.
// It is just for experimenting with communication between contracts.
contract VoteToken is ERC20 {

	// Internal by default (like protected in java)
	address creator;
	uint numberOfVoteTokens;
	mapping(address => uint) balances;

	function VoteToken(uint _numberOfVoteTokens) {
		creator = msg.sender;
		numberOfVoteTokens = _numberOfVoteTokens;
	}

	function totalSupply() constant returns (uint supply) {
		supply = numberOfVoteTokens;
	}

	function balanceOf( address who ) constant returns (uint value) {
		value = balances[who];
	}

    function allowance( address owner, address spender ) constant returns (uint _allowance) {
    	
    }

    function transfer( address to, uint value) returns (bool ok) {

    }

    function transferFrom( address from, address to, uint value) returns (bool ok) {

    }

    function approve( address spender, uint value ) returns (bool ok) {

    }
}