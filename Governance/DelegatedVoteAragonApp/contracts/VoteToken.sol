pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract VoteToken is ERC20 {

    constructor() public {
        _mint(msg.sender, 1000);
    }
}
