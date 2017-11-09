pragma solidity ^0.4.18;


contract AssemblyExperiment {

    // Used in doStandardDelegateCall()
    uint public updateByDelegate;

    function getFunctionSig() public pure returns (bytes4) {
        // bytes4 truncates everything beyond the first 4 bytes.
        bytes4 func;
        assembly { func := calldataload(0) }
        return func;
    }

    function getMemory() public pure returns (bytes32) {
        bytes32 memoryData;
        assembly {
            // Location 0x40 holds the location of where free memory begins.
            // If we want to put something in memory, eg to return a value using assembly, we
            // should update the pointer at location 0x40 to point to the new free memory location.
            memoryData := mload(0x40)
        }
        return memoryData;
    }

    // Standard delegate call cannot return a value.
    // delegatecall() is useful for reusing functionality without having to redeploy contracts, making calls cheaper.
    // Everywhere delegate call is used needs to be scrutinised as the called contract has access to storage of calling
    // contract. We should almost never allow a delegatecall to an unsafe/unknown contract (eg like the below).
    function doStandardDelegateCall(address delegateToAddress, string functionToCall) public {
        bytes4 functionSigBytes = getFunctionSigBytes(functionToCall);
        delegateToAddress.delegatecall(functionSigBytes);
    }

    function doAssemblyDelegateCall(address delegateToAddress, string bytes32FunctionToCall)
    public
    view
    returns (bytes32)
    {
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

    function getFunctionSigBytes(string functionSig) public pure returns (bytes4) {
        bytes4 functionSigBytes = bytes4(keccak256(functionSig));
        return functionSigBytes;
    }

    function testBytes1() public pure returns (bytes1) {
        bytes1 oneByte = 0x12;
        return oneByte;
    }

    function testByteArray() public view returns (byte[]) {
        byte[] storage byteArray;
        byteArray.push(0x12);
        return byteArray;
    }

}
