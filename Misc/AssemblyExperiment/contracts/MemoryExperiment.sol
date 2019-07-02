pragma solidity ^0.5.0;

// Code used to investigate data location references, copied into and experimented with in remix using the live compiler.
// Doesn't actually do anything and hasn't been tested. Kept here for future reference.
// Note, the stack is often talked about but I can't find any way of explicitly accessing the stack outside of assembly.
// But all operations access/modify the stack.

// 'Storage completely loaded' in remix I believe shows the MerkleTree node address along with the key, value pair
// for the storage locations data. Starting at 0.
contract MemoryExperiment {

    uint[] _storageArray;
    mapping(address => uint) storageMapping;
    ExampleStruct _storageStruct;

    struct ExampleStruct {
        uint someInt;
        string someString;
        bytes someBytes;
    }

    // It seems any complex type created in a function must be declared as a memory var.
    // To declare it as a storage var it must reference a var in storage, declared at the global scope.
    // Storage types can change size at runtime, memory types cannot. This is because Storage is a
    // mapping with an infinite address space. Memory is an array that can be added too but would
    // be inefficient to resize during runtime.
    function complexDataInMemory(uint[] memory strArray, uint number, string memory stringArg) public {

        uint[] memory memoryArray = new uint[](7);
        uint[3] memory memoryArray2 = [uint(1), 2, 3];
        uint[] storage storageArray = _storageArray;

        memoryArray.length;
        // cannot be changed
        storageArray.length = 123;
        // can be changed
        storageArray.push(123);
        // can be added too


        // Memory mapping's are not possible
        mapping(address => uint) storage mappo = storageMapping;


        ExampleStruct memory memoryStruct = ExampleStruct(6, "HOLA", new bytes(6));
        ExampleStruct storage storageStruct = _storageStruct;

        memoryStruct.someBytes.length;
        storageStruct.someBytes.length = 123;


        string memory memoryString = "CHECHANG";
        string storage storageString = _storageStruct.someString;

        // memoryString.length; This can't be done, string doesn't have length or index access


        bytes memory memoryBytes = new bytes(32); // Dynamically sized byte array, similar to byte[] but packed tightly in call data. Not dynamically sized when in memory, only in storage.
        bytes storage storageBytes = _storageStruct.someBytes;
        bytes1 memoryBytesFixed1 = 0xAB;
        bytes2 memoryBytesFixed2 = 0xABCD;

        memoryBytes.length;
        storageBytes.length = 123;
    }

    function returnValueDataLocationTest() public returns (uint[] memory) {

    }

    // Cannot change arguments to an external function, as the storage location is calldata, not sure why.
    function externalFunctionDataLocationTest(uint[] calldata uintArrayArg) external {
        // uintArrayArg[0] = 12; This can't be done as calldata cannot be modified.
        uint[] memory memoryArray = uintArrayArg;
        memoryArray[0] = 12;
    }
}
