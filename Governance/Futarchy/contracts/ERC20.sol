pragma solidity ^0.4.11;

contract ERC20 {
	// Removed in favour of auto created getter function
    // function totalSupply() constant returns (uint supply);
    function balanceOf( address who ) constant returns (uint value);
    function allowance( address owner, address spender ) constant returns (uint _allowance);

    function transfer( address to, uint value) returns (bool ok);
    function transferFrom( address from, address to, uint value) returns (bool ok);
    function approve( address spender, uint value ) returns (bool ok);

    event Transfer( address indexed from, address indexed to, uint value);
    event Approval( address indexed owner, address indexed spender, uint value);
}