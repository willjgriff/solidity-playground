pragma solidity ^0.4.11;

contract IpfsTest {

	string public ipfsHash;
	
	function setIpfsHash(string _ipfsHash) {
	    ipfsHash = _ipfsHash;
	}
}