pragma solidity ^0.4.11;

import "./token/ERC20.sol";

contract IpfsTest {

	string public ipfsHash;
	
	function setIpfsHash(string _ipfsHash) {
	    ipfsHash = _ipfsHash;
	}
}