pragma solidity ^0.4.13;

contract DispatcherStorage {

    address public libraryAddress;

    mapping (bytes4 => uint32) public returnTypeSizes;

    function DispatcherStorage(address initialLibraryAddress) {
        returnTypeSizes[bytes4(sha3("getUint(LibraryInterface.LibraryData storage)"))] = 32;
        updateLibraryAddress(initialLibraryAddress);
    }

    function updateLibraryAddress(address updatedLibraryAddress) /* onlyDAO */ {
        libraryAddress = updatedLibraryAddress;
    }
}
