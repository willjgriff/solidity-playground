pragma solidity ^0.4.25;

import "./ECTools.sol";

contract MetaTxProxy {

    address public _signer;
    mapping(bytes32 => bool) public _isExecuted;

    constructor() public {
        _signer = msg.sender;
    }

    event BasicSendSuccessful(address receiver, uint256 value);

    function () public payable {}

    function isExecuted(bytes32 hash) view public returns (bool) {
        return _isExecuted[hash];
    }

    function getHashOf(address receiver, uint256 value) pure public returns (bytes32) {
        return keccak256(abi.encodePacked(receiver, value));
    }

    function getSigner(bytes32 messageHash, bytes signature) view public returns (address) {
        return ECTools.prefixedRecover(messageHash, signature);
    }

    function basicSend(address receiver, uint256 value, bytes signature) public {
        bytes32 messageHash = getHashOf(receiver, value);
        require(!_isExecuted[messageHash]);
        _isExecuted[messageHash] = true;

        address signer = getSigner(messageHash, signature);
        require(signer == _signer);

        receiver.transfer(value);
        emit BasicSendSuccessful(receiver, value);
    }

}
