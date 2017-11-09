pragma solidity ^0.4.11;

contract Reentrance {

    mapping(address => uint) public balances;

    function donate(address _to) public payable {
        balances[_to] += msg.value;
    }

    function balanceOf(address _who) public constant returns (uint balance) {
        return balances[_who];
    }

    function withdraw(uint _amount) public {
        if(balances[msg.sender] >= _amount) {
            // Note that the Solidity address.call function evaluates the gas necessary to complete the
            // function after the call has been completed and subtracts that from the gas given to the called contract.
            // This prevents OOG issues when the called contract consumes all the gas.
            if(msg.sender.call.value(_amount)()) {
                _amount;
            }
            balances[msg.sender] -= _amount;
        }
    }

    function() payable {}
}