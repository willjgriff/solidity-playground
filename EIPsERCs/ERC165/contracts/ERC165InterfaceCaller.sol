pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";
import "openzeppelin-solidity/contracts/introspection/IERC165.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "./ERC165InterfaceImplementer.sol";

/**
 * The assembly staticcall in the ERC165Checker is necessary to enable calling of a function `supportsInterface()` without
 * the need to import the interface into Solidity. To call it outside of assembly the contract would need to be imported
 * otherwise there would be compiler errors. The assembly staticcall also ensures calls don't change state of the called
 * contract prior to Solidity v0.5.0.
 */
contract ERC165InterfaceCaller {

    using ERC165Checker for address;

    bytes4 private constant ERC165_IMPLEMENTER_INTERFACE_ID = 0x1a78bc72;

    // Note that this doesn't check for 0xffffffff and the supportsInterface() interface.
    function callImplementation(address erc165Address) public view returns (uint256) {
        IERC165 erc165 = IERC165(erc165Address);

        if (erc165.supportsInterface(ERC165_IMPLEMENTER_INTERFACE_ID)) {
            ERC165InterfaceImplementer erc165InterfaceImplementer = ERC165InterfaceImplementer(erc165Address);
            return erc165InterfaceImplementer.someFunction();
        } else {
            return 456;
        }
    }

    function callImplementationUsingLib(address erc165Address) public view returns (uint256) {
        if (erc165Address._supportsInterface(ERC165_IMPLEMENTER_INTERFACE_ID)) {
            ERC165InterfaceImplementer erc165InterfaceImplementer = ERC165InterfaceImplementer(erc165Address);
            return erc165InterfaceImplementer.someFunction();
        } else {
            return 456;
        }
    }

}
