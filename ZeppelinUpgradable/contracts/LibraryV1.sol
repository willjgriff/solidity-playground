pragma solidity ^0.4.13;

import "./LibraryInterface.sol";

library LibraryV1 {

    function getUint(LibraryInterface.LibraryData storage self) returns (uint) {
        return self.libraryVar;
    }

    function setUint(LibraryInterface.LibraryData storage self, uint libraryVar) {
        self.libraryVar = libraryVar;
    }
}
