pragma solidity ^0.4.13;

import "./ERC23Receiver.sol";

contract StandardERC23Receiver is ERC23Receiver {

    function tokenFallback(address from, uint value, bytes data) {
        // Store arguments for contract usage later.
    }
}
