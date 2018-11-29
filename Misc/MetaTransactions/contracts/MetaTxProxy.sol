pragma solidity ^0.4.25;

import "./EcTools.sol";

contract MetaTxProxy {

    address public _signer;
    // This doesn't work as a user may want to submit the same transaction twice. Should be a mapping to a nonce.
    mapping(bytes32 => uint256) public _transactionHashNonce;

    // For enabling the relayer to deploy the contract see:
    // https://medium.com/limechain/part-two-second-layer-solutions-a-journey-into-meta-transactions-counterfactual-instantiation-b3758507af03
    // Also useful to understand how to do counterfactual instantiation using ethers lib
    // Counterfactual instantiation process also described here: https://medium.com/gitcoin/counterfactual-loan-repayment-828a59d9b730
    constructor() public {
        _signer = msg.sender;
    }

    function () public payable {}

    function getTransactionHashNonce(bytes32 transactionHash) view public returns (uint256) {
        return _transactionHashNonce[transactionHash];
    }

    function getTransactionHash(address target, uint256 value, bytes data, uint256 reward) view public returns (bytes32) {
        bytes32 transactionHash = getTransactionHashWithoutNonce(target, value, data, reward);
        uint256 transactionNonce = _transactionHashNonce[transactionHash];
        return getTransactionHashWithNonce(target, value, data, reward, transactionNonce);
    }

    function getTransactionHashWithoutNonce(address target, uint256 value, bytes data, uint256 reward) pure private returns (bytes32) {
        return keccak256(abi.encodePacked(target, value, data, reward));
    }

    function getTransactionHashWithNonce(address target, uint256 value, bytes data, uint256 reward, uint256 nonce) pure private returns (bytes32) {
        return keccak256(abi.encodePacked(target, value, data, reward, nonce));
    }

    function getSigner(bytes32 messageHash, bytes signature) view public returns (address) {
        return EcTools.prefixedRecover(messageHash, signature);
    }

    function executeTransaction(address target, uint256 value, bytes data, uint256 reward, uint256 nonce, bytes signature) public {
        verifySignature(target, value, data, reward, signature);
        verifyAndUpdateNonce(target, value, data, reward, nonce);

        msg.sender.transfer(reward);
        require(target.call.value(value)(data), "External call/transfer was unsuccessful");
    }

    function verifySignature(address target, uint256 value, bytes data, uint256 reward, bytes signature){
        bytes32 messageHash = getTransactionHash(target, value, data, reward);
        address signer = getSigner(messageHash, signature);
        require(signer == _signer, "Invalid signer");
    }

    function verifyAndUpdateNonce(address target, uint256 value, bytes data, uint256 reward, uint256 nonce) view private {
        bytes32 txHashWithoutNonce = getTransactionHashWithoutNonce(target, value, data, reward);
        uint256 currentNonce = _transactionHashNonce[txHashWithoutNonce];
        require(currentNonce == nonce, "Incorrect or previously used nonce");
        _transactionHashNonce[txHashWithoutNonce]++;
    }
}
