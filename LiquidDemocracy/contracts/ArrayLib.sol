pragma solidity ^0.4.15;

library ArrayLib {

    function removeElement(address[] storage self, uint position) {
        require(self.length > 0);

        uint lastElement = self.length - 1;
        self[position] = self[lastElement];
        self.length = self.length - 1;
    }

}
