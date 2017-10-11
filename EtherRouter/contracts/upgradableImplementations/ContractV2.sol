pragma solidity ^0.4.15;

import "./ContractInterface.sol";
import "../Resolver.sol";

contract ContractV2 is ContractInterface {

    Resolver public resolver;
    uint public storageValue;
    string public dynamicallySizedValue;
    uint[] public updatedDynamicallySizedValue;

    function returnValue() public constant returns (uint) {
        return 20;
    }

    function setStorageValue(uint value) public {
        storageValue = value * 2;
    }

    function getStorageValue() public constant returns (uint) {
        return storageValue;
    }

    function setDynamicallySizedValue(string dynamicValue) public {}

    function getDynamicallySizedValue() public constant returns (string) {}

    /**
     * @notice Updated functions returning a different dynamically sized value.
     *         Ideally we would do our best to avoid changing the signature of updated functions.
     *         If adhering to an interface we have to keep empty functions around that we may or may
     *         not wish to register with the resolver depending on the situation.
     *         If we keep them we must also keep the function returning the return size.
     *         We must also update calling code to use the new signatures.
     */
    function setDynamicallySizedValue(uint[] _updatedDynamicallySizedValue) public {
        updatedDynamicallySizedValue = _updatedDynamicallySizedValue;
    }

    /**
     * @notice This function signature must be different than the one in the interface.
     *         Note the return value does not contribute to the signature.
     */
    function getUpdatedDynamicallySizedValue() public constant returns (uint[]) {
        return updatedDynamicallySizedValue;
    }

    function getDynamicallySizedValueSize() public constant returns (uint) {
        return updatedDynamicallySizedValue.length;
    }
}
