var YouTubeToken = artifacts.require("./YouTubeToken.sol")
var youTubeToken = YouTubeToken.at(YouTubeToken.address)

var subscriptionCountUpdatedEvent = youTubeToken.LogBalanceUpdatedWithSubscriptionCount();
var watchForSubscription = () => subscriptionCountUpdatedEvent.watch((error, response) => {
	if (!error) {
		console.log("Subscriber: " + response.args.subscriber + " Subscription Count: " + response.args.subscriptionCount)
	} else {
		console.log(error)
	}
	subscriptionCountUpdatedEvent.stopWatching()
})

var debugQuer = youTubeToken.DebugQuery();
var debugQuery = () => debugQuer.watch((error, response) => {
	if (!error) {
		console.log("Query: " + response.args.query)
	} else {
		console.log(error)
	}
	debugQuer.stopWatching()
})

var getOraclizeCost = () => youTubeToken.getOraclizeFee()
	.then(fee => { console.log("Oraclize Fee: " + fee); return fee })

var addUsersSubscriptions = (user, account) => {
	watchForSubscription()
	debugQuery()
	getOraclizeCost()
		.then(fee => youTubeToken.registerUser(user, web3.eth.accounts[account], { value: fee }))
		.then(tx => console.log("Requested subscriptions to be added for user: " + user))
}

var displaySubscriptionCount = (user) => youTubeToken.balanceOf(user)
	.then(result => console.log("SubscriberCount for user " + user + ": " + result))

var balanceOf = account => youTubeToken.balanceOf(web3.eth.accounts[account])
	.then(balance => console.log("Account " + account + " balance: " + balance))

// addUsersSubscriptions("expovistaTV", 1) 
// addUsersSubscriptions("GeriGFX", 2)

balanceOf(2)

// youTubeToken.totalSupply()
// 	.then(totalSupply => console.log("Total Supply: " + totalSupply.toNumber()))

module.exports = (callback) => {}