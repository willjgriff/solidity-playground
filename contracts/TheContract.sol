pragma solidity ^0.4.13;

import "./LibraryInterface.sol";

contract TheContract {

    using LibraryInterface for LibraryInterface.LibraryData;

    LibraryInterface.LibraryData libraryInstance;

    function get() constant returns (uint) {
        return libraryInstance.getUint();
    }

    function set(uint libraryVar) {
        return libraryInstance.setUint(libraryVar);
    }
}
