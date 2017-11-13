pragma solidity ^0.4.17;

import "./upgradableImplementations/ContractInterface.sol";

contract UpgradableContractProxy {

    ContractInterface private upgradableContract;

    function UpgradableContractProxy(address initialContractImplAddress) {
        upgradableContract = ContractInterface(initialContractImplAddress);
    }

    function () public {
        bool contractCallSuccess = delegatecall
    }

//    function symbol() public view returns (string) {
//        if (bts_address1.call(bytes4(keccak256("symbol()")))) {
//            assembly {
//                returndatacopy(0,0, returndatasize)
//                return(0, returndatasize)
//            }
//        }
//    }

}
