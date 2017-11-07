pragma solidity ^0.4.15;


contract AssemblyExperiment {

    function getFunctionSig() public constant returns (bytes4) {
        // bytes4 truncates everything beyond the first 4 bytes.
        bytes4 func;
        assembly { func := calldataload(0) }
        return func;
    }

    function getMemory() public constant returns (bytes32) {
        bytes32 memoryData;
        assembly {
            // Location 0x40 holds the location of where free memory begins.
            // If we want to put something in memory, eg to return a value using assembly, we
            // should update the pointer at location 0x40 to point to the new free memory location.
            memoryData := mload(0x40)
        }
        return memoryData;
    }

    // Test different delegatecalls. Assembly delegatecall vs standard delegatecall.
    // I think the assembly delegatecall can return a value but the standard one can't.
//    function doStandardDelegateCall(address delegateToAddress) {
//
//    }

    // TODO: Check out the delegatecall reddit post again to understand it's advantages.
    function doAssemblyDelegateCall(address delegateToAddress, string bytes32FunctionToCall) public constant returns(bytes32) {
        uint256 callSuccessValue;
        bytes4 functionSigBytes = getFunctionSigBytes(bytes32FunctionToCall);

        assembly {
            let freeMemLocation := mload(0x40)
            mstore(freeMemLocation, functionSigBytes)
            callSuccessValue := delegatecall(sub(gas, 500), delegateToAddress, freeMemLocation, 4, freeMemLocation, 32)
            // Note in reality we should check the callSuccessValue before returning
            return (freeMemLocation, 32)
        }
    }

    function getFunctionSigBytes(string functionSig) public constant returns (bytes4) {
        bytes4 functionSigBytes = bytes4(sha3(functionSig));
        return functionSigBytes;
    }

    function testBytes1() public constant returns (bytes1) {
        bytes1 oneByte = 0x12;
        return oneByte;
    }

    function testByteArray() public constant returns (byte[]) {
        byte[] byteArray;
        byteArray.push(0x12);
        return byteArray;
    }

}
