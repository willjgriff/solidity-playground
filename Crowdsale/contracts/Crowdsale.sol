pragma solidity ^0.4.11;

contract Crowdsale {

	address public creator;
	uint public targetAmount;
	uint public campaignEnd;
	mapping(address => uint) public fundersContributions;
	address[] public contributors;
	
	modifier onlyCreator() {
	    if (msg.sender != creator) throw;
	    _;
	}

	modifier targetRaised() {
		if (targetAmount < this.balance) throw;
		_;
	}
	
	modifier beforeSaleEnd() {
	    if (campaignEnd > now) throw;
	    _;
	}
	
	modifier afterSaleEnd() {
	    if (campaignEnd < now) throw;
	    _;
	}

	function Crowdsale(uint _targetAmount, uint _campaignDuration) {
	    creator = msg.sender;
		targetAmount = _targetAmount;
		campaignEnd = now + _campaignDuration;
	}

	function contribute() payable beforeSaleEnd {
		fundersContributions[msg.sender] += msg.value;
		contributors.push(msg.sender);
	}
	
	function returnContribution() afterSaleEnd {
	    msg.sender.transfer(fundersContributions[msg.sender]);
	    fundersContributions[msg.sender] = 0;
	}
	
	function finaliseContributions() afterSaleEnd targetRaised {
	    creator.transfer(this.balance);
	}
	
	function deleteContract() onlyCreator {
	    suicide(creator);
	}
	
	function() {
		throw;
	}

}