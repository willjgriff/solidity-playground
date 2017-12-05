pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract UsDollarToken is StandardToken {

    string public name;
    string public symbol;
    uint8 public decimals;

    function UsDollarToken() {
        name = "US Dollar";
        symbol = "USD";
        decimals = 18;
    }
}
