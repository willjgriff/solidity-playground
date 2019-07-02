pragma solidity ^0.4.18;


// Memory is byte address. Eg 0x01 = first byte of memory, 0x02 = second byte of memory
// Storage is word addressed. Eg 0x01 = first 32 bytes of storage, 0x02 = second 32 bytes of storage
// This is why there's little point using anything other than uint256 in storage, anything stored there will still update 32 bytes.

// External functions: https://ethereum.stackexchange.com/questions/19380/external-vs-public-best-practices
// Cannot call an external function internally (this.externalFunction()) if it updates storage. Cannot
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

    // From here: https://www.reddit.com/r/ethdev/comments/7btqix/bug_converting_string_to_bytes32/
    function stringToBytes32(string memory source) pure returns (bytes32 result) {
        // Why we need the below check:
        // It seems memory is structured into 32 byte slots. Arrays consist of a 32 byte slot that represents it's size
        // (length) in whatever the type specifies (eg, a string is a byte array, so the size is how many individual bytes
        // the array is made up of, alternatively for a uint256[] array which consists of 32 byte slots, the size is how many
        // 32 byte slots it takes up) followed by 32 byte chunks of the bytes of the data (as many 32 byte slots as is
        // required to store the whole length of the array).

        // This means that if you pass an empty string or pass nothing, the first 32 byte slot of the string (length)
        // is 0 and the following 32 byte slot which would hold the first 32 bytes of the data has nothing to go in it
        // so will just be used for the next thing stored in memory (which is what would be loaded by the following assembly code).
        // There's no point reserving an en empty 32 byte slot for no data.
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        // Note that it seems when we use source outside the context of a string then source refers to the address of
        // source in mem, not the string it points to. Also note that the first 32 bytes of a string/array seem to
        // represent the length of the string/array. Which is why we skip the first 32 bytes.
        assembly {
            result := mload(add(source, 32))
            // This is the same as the above:
            // return(add(source, 32), 32)
        }
    }

}
