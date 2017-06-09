pragma solidity ^0.4.11;

contract Vote {

	enum Party { Conservative, Labour, Libdem, Green }

	struct Voter {
		bool registered;
		bool voted;
		address delegate;
	}

    address chairPerson;
	// Party, represented as uint(party), to number of votes. 
	// Ideally should not be visible until vote is over, requires some zero-knowledge jazz...
	// Zero-knowledge jazz also needed to obscure voters from addresses.
	mapping(uint => uint) public votes;
	mapping(address => Voter) voters;
	
	modifier onlyChair() {
	    if (msg.sender != chairPerson) throw;
	    _;
	}

	modifier registeredToVote() {
		if (voters[msg.sender].registered == false) throw;
		_;
	}
	
	modifier notYetVoted(address who) {
	    if (voters[who].voted == true) throw;
	    _;
	}
	
	modifier delegatedToVoteFor(address originalVoter) {
	    if (voters[originalVoter].delegate != msg.sender) throw;
	    _;
	}

	function Vote() {
        chairPerson = msg.sender;
	}

	function registerVoter(address voter) onlyChair {
        voters[voter].registered = true;
	}
	
	function unregisterVoter(address voter) onlyChair {
	    voters[voter].registered = false;
	}

	function delegateVote(address delegate) registeredToVote {
	    voters[msg.sender].delegate = delegate;
	}

	function castVote(Party vote) 
	    registeredToVote 
	    notYetVoted(msg.sender)
	{
        castVote(msg.sender, vote);
	}
	
	function castDelegateVote(address originalVoter, Party vote) 
	    delegatedToVoteFor(originalVoter)
	    notYetVoted(originalVoter)
	{
	    castVote(originalVoter, vote);
	}
	
	function castVote(address voter, Party vote) private {
	    votes[uint(vote)] += 1;
        voters[voter].voted = true;
	}

}