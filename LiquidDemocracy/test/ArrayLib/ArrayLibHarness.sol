pragma solidity ^0.4.15;

import "../../contracts/ArrayLib.sol";

contract ArrayLibHarness {

    using ArrayLib for address[];

    address[] private storageArray;

    function removeElement(address[] array, uint position) public constant returns (address[]) {
        storageArray = array;
        storageArray.removeElement(position);
        return storageArray;
    }

}
