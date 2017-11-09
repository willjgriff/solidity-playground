pragma solidity ^0.4.13;

import "./DispatcherStorage.sol";

contract Dispatcher {

    function() {
        // As this is linked to as a library, we can't access this contract's account's storage.
        // Therefore we must hard code the DispatcherStorage address. The address (currently
        // "0x1111222233334444555566667777888899990000") will be set manually before deployment.
        DispatcherStorage dispatcherStorage = DispatcherStorage(0x1111222233334444555566667777888899990000);
        uint32 functionReturnTypeSize = dispatcherStorage.returnTypeSizes(msg.sig);
        address libraryAddress = dispatcherStorage.libraryAddress();

        assembly {
            // Copy from function callData to memory for access in delegatecall()
            calldatacopy(0x0, 0x0, calldatasize)

            // Make delegatecall() to the contract at libraryAddress with the now copied callData in memory.
            // Put the return value in memory starting at address 0x0 ending at functionReturnTypeSize.
            // Allow it to use the remaining gas - 10000 for execution.
            let a := delegatecall(sub(gas, 10000), libraryAddress, 0x0, calldatasize, 0x0, functionReturnTypeSize)
            return (0x0, functionReturnTypeSize)
        }
    }
}
