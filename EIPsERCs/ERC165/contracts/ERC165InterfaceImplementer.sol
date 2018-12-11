pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";

contract ERC165InterfaceImplementer is ERC165 {

    bytes4 public constant ERC165_INTERFACE_ID = // 0xca8b30dc;
        bytes4(keccak256("someFunction()")) ^
        bytes4(keccak256("someOtherFunction(uint256[])"));

    bytes4 public constant ERC165_INTERFACE_ID_ALT =
        this.someFunction.selector ^
        this.someOtherFunction.selector;

    constructor() public {
        _registerInterface(ERC165_INTERFACE_ID);
    }

    function someFunction() public returns (uint256) {
        return 123;
    }

    function someOtherFunction(uint256[] memory someArray) public {

    }
}
