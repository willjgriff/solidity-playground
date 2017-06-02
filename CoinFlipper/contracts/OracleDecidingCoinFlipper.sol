pragma solidity ^0.4.11;

import "./CoinFlipper.sol";
import "./UsingOraclize.sol";

contract OracleDecidingCoinFlipper is CoinFlipper, usingOraclize {
	
	function decideWager() payable whenState(State.wagerAccepted) {
		oraclize_query("WolframAlpha", "flip a coin");
	}

	function __callback(bytes32 oraclizeId, string result) {
		address winner = sha3(result) == sha3("heads") ? wagerMaker : wagerAccepter;
		transferWinningFunds(winner);
	}
}