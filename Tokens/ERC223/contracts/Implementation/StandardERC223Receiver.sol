pragma solidity ^0.4.15;

import "../Interface/ERC223Receiver.sol";

/*
 * @notice Abstract contract. Copied from Aragon implementation and made slightly more readable for my own understanding:
 *         https://github.com/aragon/ERC23/blob/master/contracts/implementation/Standard223Receiver.sol
 *         Also added basic tests to experiment with passing encoded function calls
 */
contract StandardERC223Receiver is ERC223Receiver {

    Transfer internal tempTransfer;
    bool internal calledFromTokenFallback;

    // Add/remove as required by the implementing contract
    struct Transfer {
        address tokenFallbackCaller;
        address originalCaller;
        address from;
        uint256 value;
        bytes data;
        bytes4 sig;
    }

    modifier tokenPayable { require(calledFromTokenFallback); _; }

    function tokenFallback(address originalCaller, address from, uint value, bytes data) returns (bool) {
        if (!tokenSupported(msg.sender)) return false;

        // Problem: This will do a sstore which is expensive gas wise. Find a way to keep it in memory.
        tempTransfer = Transfer(msg.sender, originalCaller, from, value, data, getSig(data));

        calledFromTokenFallback = true;
        if (!address(this).delegatecall(data)) return false;

        // avoid doing an overwrite to .token, which would be more expensive
        // makes accessing .tkn values outside tokenPayable functions unsafe
        calledFromTokenFallback = false;

        return true;
    }

    function getSig(bytes _data) private returns (bytes4 sig) {
        uint l = _data.length < 4 ? _data.length : 4;
        for (uint i = 0; i < l; i++) {
            sig = bytes4(uint(sig) + uint(_data[i]) * (2 ** (8 * (l - 1 - i))));
        }
    }

    function tokenSupported(address token) returns (bool);
}
