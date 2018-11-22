pragma solidity ^0.4.25;

import "./ECTools.sol";

contract MetaTxProxy {

    address public _signer;

    constructor() public {
        _signer = msg.sender;
    }

    event BasicSendSuccessful(address receiver, uint256 value);

    function () payable {}

    function getHashOf(address receiver, uint256 value) pure public returns (bytes32) {
        return keccak256(abi.encodePacked(receiver, value));
    }

    function getSigner(bytes32 messageHash, bytes signature) pure public returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedMessage = keccak256(prefix, messageHash);
        return ECTools.recover(prefixedMessage, signature);
    }

    function basicSend(address receiver, uint256 value, bytes signature) public {
        bytes32 messageHash = getHashOf(receiver, value);
        address signer = getSigner(messageHash, signature);
        if (signer == _signer) {
            receiver.send(value);
            emit BasicSendSuccessful(receiver, value);
        }
    }

}
