pragma solidity ^0.4.11;

// Abstract contract made by decideWager function.
// Should probably be a library of some sort. Composition over inheritance and all that!
contract CoinFlipper {
	
	enum State { noWager, wagerMade, wagerAccepted }
	
	State public state = State.noWager;
	address wagerMaker;
	address wagerAccepter;
	uint seedBlockNumber;

	modifier whenState(State currentState) {
		if (state == currentState) {
			_;
		} else {
			throw;
		}
	}
	
	modifier whenTxValueEqualsBalance {
		if (msg.value == this.balance - msg.value) {
			_;
		} else {
			throw;
		}
	}

	function makeWager() 
		payable 
		whenState(State.noWager)
	{
		wagerMaker = msg.sender;
		state = State.wagerMade;
	}
	
	function acceptWager()
		payable
		whenState(State.wagerMade)
		whenTxValueEqualsBalance
	{
		wagerAccepter = msg.sender;
		seedBlockNumber = block.number;
		state = State.wagerAccepted;
	}
	
	function decideWager() payable whenState(State.wagerAccepted);

	function transferWinningFunds(address winner) internal {
		winner.transfer(this.balance);
		state = State.noWager;
	}
}