pragma solidity ^0.4.11;

import "./Oraclize.sol";
import "./utils/SafeMath.sol";

contract YouTubeSubscribers is usingOraclize {

	using SafeMath for uint;

	string public queryString;
	string public userParam;
	string public jsonPath;
	string internal apiKey;
	address internal queryUpdater;

	uint internal totalSubscriptionCount;
	mapping(string => uint) internal subscriptionCounts;
	mapping(bytes32 => string) private queriedUsers;

	event LogSubscriptionCountUpdated(string subscriber, uint subscriptionCount);
	
	event Debug(string query);

	modifier onlyQueryUpdater() {
		if (queryUpdater != msg.sender) revert();
		_;
	}

	modifier validOraclizeId(bytes32 oraclizeId) {
		if (sha3(queriedUsers[oraclizeId]) == sha3("")) revert();
		_;
	}

	modifier notAlreadyAdded(string user) {
		if (subscriptionCounts[user] > 0) revert();
		_;
	}

	// This should have a multi-sig wallet setter.
	function setQuery(string _queryString, string _userParam, string _jsonPath, string _apiKey) public onlyQueryUpdater {
		queryString = _queryString;
		userParam = _userParam;
		jsonPath = _jsonPath;
		apiKey = _apiKey;
	}

	function addSubscriptionCount(string user) public payable notAlreadyAdded(user) {
		string memory fullQueryString = createOraclizeRequestString(user);
		Debug(fullQueryString);
		bytes32 queryId = oraclize_query("URL", "fullQueryString");
		queriedUsers[queryId] = user;
	}

	function __callback(bytes32 oraclizeId, string subscriptionCount) public validOraclizeId(oraclizeId) {
		string memory user = queriedUsers[oraclizeId];
		queriedUsers[oraclizeId] = "";
		
		uint subscriptionCountInt = parseInt(subscriptionCount);
		subscriptionCounts[user] = subscriptionCountInt;
		totalSubscriptionCount = totalSubscriptionCount.add(subscriptionCountInt);
		LogSubscriptionCountUpdated(user, subscriptionCountInt);
	}
	 
	function subscriptionCount(string subscriber) public constant returns(uint) {
		return subscriptionCounts[subscriber];
	}

	// eg json(https://www.googleapis.com/youtube/v3/channels?key=AIzaSyDcEFmmIi4q8GiDwtvxTuFyjocKes-WyGk&part=statistics&forUsername=expovistaTV).items.0.statistics.subscriberCount";
	function createOraclizeRequestString(string user) private constant returns(string) {
		string memory fullUserParam = strConcat(userParam, "=", user);
		string memory apiKeyParam = strConcat("key=", apiKey);
		string memory requestUrl = strConcat(queryString, "&", fullUserParam, "&", apiKeyParam);
		string memory oraclizeRequest = strConcat("json(", requestUrl, ").", jsonPath);
		return oraclizeRequest;
	}

	function() {
		revert();
	}
}