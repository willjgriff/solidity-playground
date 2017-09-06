pragma solidity ^0.4.0;

import "./FallbackFuncInterface.sol";

contract FallbackLibraryDelegate {

    function callFallbackContract() {
        FallbackFuncInterface.callFallback();
    }
}
