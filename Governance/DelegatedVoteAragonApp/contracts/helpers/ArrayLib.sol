pragma solidity ^0.4.24;

library ArrayLib {

    function _removeElement(address[] storage self, uint256 position) internal {
        require(self.length > 0);

        uint256 lastElement = self.length - 1;
        self[position] = self[lastElement];
        self.length = self.length - 1;
    }

}
