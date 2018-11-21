pragma solidity ^0.4.25;

import "./ECTools.sol";

contract MetaTxProxy {

    address public signer;

    constructor() public {
        signer = msg.sender;
    }

    function getHashOf() pure public returns (bytes32) {
        return keccak256(abi.encodePacked("Hola"));
    }

    function getSigner(bytes32 message, bytes signature) pure public returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedMessage = keccak256(prefix, message);
        return ECTools.recover(prefixedMessage, signature);
    }

}
