pragma solidity ^0.4.11;

import { usingOraclize } from "./Oraclize.sol";
import { OraclizeAddrResolverI } from "./Oraclize.sol";
import "./StandardToken.sol";

contract YouTubeToken is usingOraclize, StandardToken {

	string private constant ORACLIZE_DATA_SOURCE = "URL";
	string public queryString;
	string public userParam;
	string public jsonPath;
	string internal apiKey;
	address internal queryUpdater;

	uint internal totalSubscriptionCount;
	mapping(string => bool) internal registeredUsers;
	mapping(bytes32 => QueriedUser) queriedUsers;

	struct QueriedUser {
		string username;
		address pubAddress;
	}

	event LogBalanceUpdatedWithSubscriptionCount(string subscriber, uint subscriptionCount);
	event DebugQuery(string query);

	function YouTubeToken() {
		// TODO: Delete this, for testing with private chain (testrpc) only
		OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
		queryUpdater = msg.sender;

		queryString = "https://www.googleapis.com/youtube/v3/channels?part=statistics";
		userParam = "forUsername";
		jsonPath = "items.0.statistics.subscriberCount";
		apiKey = "AIzaSyBZARNvH2aCLG6PSeTGlOIQT9yTM4NXr0s";
	}

	modifier onlyQueryUpdater() {
		if (queryUpdater != msg.sender) revert();
		_;
	}

	modifier notRegistered(string user) {
		if (registeredUsers[user]) revert();
		_;
	}

	modifier hasOraclizeFee() {
		if (getOraclizeFee() > this.balance) revert();
		_;
	}

	modifier validOraclizeId(bytes32 oraclizeId) {
		if (sha3(queriedUsers[oraclizeId].username) == sha3("")) revert();
		_;
	}

	// This should have a multi-sig wallet setter.
	function setQuery(string _queryString, string _userParam, string _jsonPath, string _apiKey)
	public 
	onlyQueryUpdater 
	{
		queryString = _queryString;
		userParam = _userParam;
		jsonPath = _jsonPath;
		apiKey = _apiKey;
	}

	function getOraclizeFee() public constant returns(uint) {
		return oraclize_getPrice(ORACLIZE_DATA_SOURCE) * 2;
	}

	// This requires an Oraclize request with a secure service that returns a verified address for a given Youtube username.
	// The service would require a Youtube user to log in to their account and send a public address (ideally with an
	// ec signature) to a centralised server which can then be relayed here instead of passing it in the below function.
	function registerUser(string user, string usersAddress)
	public
	payable
	notRegistered(user)
	hasOraclizeFee
	{
		// bytes32 queryId = oraclize_query(Request address for specified user)
		bytes32 queryId = 123;
		queriedUsers[queryId].username = user;
		__callback(queryId, usersAddress);
	}

	function __callback(bytes32 oraclizeId, string response) 
	public 
	validOraclizeId(oraclizeId) 
	{
		if (queriedUsers[oraclizeId].pubAddress == 0) {
			getSubscriptionCount(oraclizeId, response);
		} else {
			updateBalanceWithSubscriptionCount(oraclizeId, response);
		}
	}

	function getSubscriptionCount(bytes32 oraclizeId, string response) private {
		address usersAddress = parseAddr(response);
		string memory username = queriedUsers[oraclizeId].username;
		string memory fullQueryString = createOraclizeRequestString(username);
		DebugQuery(fullQueryString);

		bytes32 queryId = oraclize_query(ORACLIZE_DATA_SOURCE, fullQueryString);
		queriedUsers[queryId] = QueriedUser(username, usersAddress);
	}

	function updateBalanceWithSubscriptionCount(bytes32 oraclizeId, string response) private {
		QueriedUser memory user = queriedUsers[oraclizeId];
		delete queriedUsers[oraclizeId];
		
		uint subscriptionCountInt = parseInt(response);
		balances[user.pubAddress].add(subscriptionCountInt);
		registeredUsers[user.username] = true;
		totalSubscriptionCount = totalSubscriptionCount.add(subscriptionCountInt);

		LogBalanceUpdatedWithSubscriptionCount(user.username, subscriptionCountInt);
	}

	function totalSupply() public constant returns(uint) {
		return totalSubscriptionCount;
	}

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