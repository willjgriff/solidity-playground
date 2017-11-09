pragma solidity ^0.4.13;

library LibraryInterface {

    struct LibraryData {uint libraryVar;}

    function getUint(LibraryData storage self) returns (uint);

    function setUint(LibraryData storage self, uint libVar);
}
