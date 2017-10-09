pragma solidity ^0.4.13;

import "./ERC223Receiver.sol";

contract StandardERC223Receiver is ERC223Receiver {

    function tokenFallback(address from, uint value, bytes data) {
        // Store arguments for contract usage later.
    }
}
