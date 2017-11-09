pragma solidity ^0.4.13;

import "./LibraryInterface.sol";

library LibraryV2 {

    function getUint(LibraryInterface.LibraryData storage self) returns (uint) {
        return self.libraryVar * 10;
    }

    function setUint(LibraryInterface.LibraryData storage self, uint libraryVar) {
        self.libraryVar = libraryVar;
    }
}
