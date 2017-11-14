pragma solidity ^0.4.18;

library ArrayLib {

    function containsAddress(address[] storage self, address _address) returns (bool) {
        require(self.length > 0);

        for (uint i = 0; i < self.length; i++) {
            if (self[i] == _address) return true;
        }
    }

}
