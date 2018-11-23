pragma solidity ^0.4.25;

import "./EcTools.sol";

contract MetaTxProxy {

    address public _signer;
    // This doesn't work as a user may want to submit the same transaction twice. Should be a mapping to a nonce.
    mapping(bytes32 => bool) public _transactionHashExecuted;

    constructor() public {
        _signer = msg.sender;
    }

    function () public payable {}

    function transactionHashExecuted(bytes32 transactionHash) view public returns (bool) {
        return _transactionHashExecuted[transactionHash];
    }

    function getTransactionHash(address receiver, uint256 value, bytes data, uint256 reward) pure public returns (bytes32) {
        return keccak256(abi.encodePacked(receiver, value, data));
    }

    function getSigner(bytes32 messageHash, bytes signature) view public returns (address) {
        return EcTools.prefixedRecover(messageHash, signature);
    }

    function executeTransaction(address target, uint256 value, bytes data, uint256 reward, bytes signature) public {
        bytes32 messageHash = getTransactionHash(target, value, data, reward);
        require(!_transactionHashExecuted[messageHash], "Message hash already executed");
        _transactionHashExecuted[messageHash] = true;

        address signer = getSigner(messageHash, signature);
        require(signer == _signer, "Invalid signer");

        msg.sender.transfer(reward);

        require(target.call.value(value)(data), "External call/transfer was unsuccessful");
    }

}
