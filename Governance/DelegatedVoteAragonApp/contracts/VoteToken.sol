pragma solidity ^0.5.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract VoteToken is ERC20 {

    constructor() public {
        _mint(msg.sender, 1000);
    }
}
