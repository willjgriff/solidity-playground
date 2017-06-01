pragma solidity ^0.4.11;

import "./CoinFlipper.sol";
import "./UsingOraclize.sol";

contract OracleDecidingCoinFlipper is usingOraclize {
// re-add this once we get Oraclize to work.
// contract OracleDecidingCoinFlipper is CoinFlipper, usingOraclize {

	string public result;
	bytes32 public oraclizeId;
	
	// function decideWager() payable whenState(State.wagerAccepted) {
	function decideWager() payable {
		oraclizeId = oraclize_query("WolframAlpha", "flip a coin");
	}

	function __callback(bytes32 oraclizeId, string _result) {
		result = _result;
	}
}