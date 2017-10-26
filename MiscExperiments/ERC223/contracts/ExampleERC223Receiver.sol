pragma solidity ^0.4.15;

import "./Implementation/StandardERC223Receiver.sol";

contract ExampleERC223Receiver is StandardERC223Receiver {

    event LogTestCalled();
    event LogFallbackCalled();
    event LogTestWithArg(uint testArg);
    event LogTestWithTempTransfer(address tokenFallbackCaller, address originalCaller, address from, uint256 value, bytes data);

    function () tokenPayable {
        LogFallbackCalled();
    }

    function test() tokenPayable {
        LogTestCalled();
    }

    function testWithArg(uint testArg) tokenPayable {
        LogTestWithArg(testArg);
    }

    function testWithTempToken() tokenPayable {
        LogTestWithTempTransfer(tempTransfer.tokenFallbackCaller, tempTransfer.originalCaller, tempTransfer.from, tempTransfer.value, tempTransfer.data);
    }

    function tokenSupported(address token) returns (bool) {
        // Should check the address is our token address
        return true;
    }
}
