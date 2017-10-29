pragma solidity ^0.4.15;


contract AssemblyExperiment {

    function getFunctionSig() constant returns (bytes4) {
        bytes4 func;
        assembly { func := calldataload(0) }
        return func;
    }

    function getMemory() constant returns (bytes32) {
        bytes32 memoryData;
        assembly { memoryData := mload(0x40) }
        return memoryData;
    }
}
