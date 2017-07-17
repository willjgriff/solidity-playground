pragma solidity ^0.4.11;

import "./Oraclize.sol";

contract YouTubeToken is usingOraclize {

	string public queryString;
	string public userParameter;
	string public jsonPath;
	address internal queryUpdater;
	mapping(string => uint) internal subscriptionCounts;
	mapping(bytes32 => string) internal queriedUsers;

	event LogSubscriptionCountUpdated(string subscriber, string subscriptionCount);

	modifier onlyQueryUpdater() {
		if (queryUpdater != msg.sender) revert();
		_;
	}

	function YouTubeToken() {
		// TODO: Delete this, for testing with private chain (testrpc) only
		OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
		queryUpdater = msg.sender;

		queryString = "https://www.googleapis.com/youtube/v3/channels?key=API_KEY_GOES_HERE&part=statistics";
		userParameter = "forUsername";
		jsonPath = "items.0.statistics.subscriberCount";
	}

	// This should have a multi-sig wallet setter.
	function setQuery(string _queryString, string _userParameter, string _jsonPath) public onlyQueryUpdater {
		queryString = _queryString;
		userParameter = _userParameter;
		jsonPath = _jsonPath;
	}

	function addSubscriptionCount(string user) public {
		string memory fullQueryString = createQueryString(user);
		bytes32 queryId = oraclize_query("URL", fullQueryString);
		queriedUsers[queryId] = user;
	}

	function __callback(bytes32 oraclizeId, string subscriptionCount) public {
		string user = queriedUsers[oraclizeId];
		subscriptionCounts[user] = parseInt(subscriptionCount);
		LogSubscriptionCountUpdated(user, subscriptionCount);
	}
	 
	function subscriptionCount(string subscriber) public constant returns(uint) {
		return subscriptionCounts[subscriber];
	}

	// eg json(https://www.googleapis.com/youtube/v3/channels?key=AIzaSyDcEFmmIi4q8GiDwtvxTuFyjocKes-WyGk&part=statistics&forUsername=expovistaTV).items.0.statistics.subscriberCount";
	function createQueryString(string user) private constant returns(string) {
		return strConcat("json(", queryString, "&", userParameter, strConcat("=", user, ").", jsonPath));
	}
}