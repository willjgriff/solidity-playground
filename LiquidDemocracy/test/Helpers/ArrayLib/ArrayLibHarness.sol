pragma solidity ^0.4.15;

import "../../../contracts/helpers/ArrayLib.sol";

// TODO: This doesn't work with our setup as we retain indexes which change when this function is called but
// aren't updated in the calling contracts. This can be fixed though. We could still use a LinkedList...
contract ArrayLibHarness {

    using ArrayLib for address[];

    address[] private storageArray;

    function removeElement(address[] array, uint position) public constant returns (address[]) {
        storageArray = array;
        storageArray.removeElement(position);
        return storageArray;
    }

}
