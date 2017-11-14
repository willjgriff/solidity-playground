pragma solidity ^0.4.18;

import "./ArrayLib.sol";

contract MultiSigExecutor {

    using ArrayLib for address[];

    mapping(address => bool) public isSigner;
    address public contractToExecute;
    uint public threshold;
    address[] public signers;

    mapping(bytes32 => address[]) public functionsRequestedByAddresses;

    function MultiSigExecutor(uint threshold, address[] memory _signers, address _contractToExecute){
        signers = _signers;
        contractToExecute = _contractToExecute;

        for (uint256 i = 0; i < _signers.length; i++) {
            isSigner[_signers[i]] = true;
        }
    }

    function executeTransaction(bytes functionCall) {
        require(isSigner[msg.sender]);
        bytes32 functionCallHash = keccak256(functionCall);
        address[] storage addressesRequested = functionsRequestedByAddresses[functionCallHash];
        require(!addressesRequested.containsAddress(msg.sender));

        addressesRequested.push(msg.sender);

        if (addressesRequested.length > threshold) {
            executeFunction(functionCall);
            addressesRequested.length = 0;
        }
    }

    function executeFunction(bytes functionCall) private {

    }
}
