pragma solidity ^0.4.0;

import "./FallbackFuncContract.sol";

contract FallbackContractDelegate {

    FallbackFuncContract private fallbackFuncContract;

    function FallbackContractDelegate(address fallbackFuncContractAddress) {
        fallbackFuncContract = FallbackFuncContract(fallbackFuncContractAddress);
    }

    function callFallbackContract() {
        fallbackFuncContract.call("asdf");
    }
}
