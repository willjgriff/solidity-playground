pragma solidity ^0.4.11;

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
	
	function decideWager() whenState(State.wagerAccepted) {
		// Primitive approach to generating randomness, partly copied from Decypher tutorials.
		// Difficult to game by miners as a miner can't mine a block, getting the hash (which determines the winner)
		// and then put a tx in it without remining the block and regenerating the hash. However, a miner could only
		// include the tx in blocks they create and not submit the block until they create one with a winning seed hash.
		// Also only works for the 256 most recent blocks as we can't get the blockHash from before then.
		uint blockHashValue = uint(block.blockhash(seedBlockNumber));
		uint halfMaxValue = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
		address winner = blockHashValue > halfMaxValue ? wagerAccepter : wagerMaker;

		winner.transfer(this.balance);
		state = State.noWager;
	}

}