pragma solidity ^0.4.11;

contract CoinFlipper {

	enum State { noWager, wagerMade, wagerAccepted }
	
	State public state = State.noWager;
	address wagerMaker;
	address wagerAccepter;

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

	function makeWager() payable whenState(State.noWager) {
        state = State.wagerMade;
        wagerMaker = msg.sender;
	}
	
	function acceptWager() 
		payable 
		whenState(State.wagerMade) 
		whenTxValueEqualsBalance 
	{
	    state = State.wagerAccepted;
	    wagerAccepter = msg.sender;
	}
	
	function decideWager() whenState(State.wagerAccepted) {
	    // This requires some randomness to determine the winner
	    wagerMaker.transfer(this.balance);
	    state = State.noWager;
	}

}