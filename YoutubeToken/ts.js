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

var debug = youTubeToken.DebugQuery();
var debugQuery = () => debug.watch((error, response) => {
	if (!error) {
		console.log("Query: " + response.args.query)
	} else {
		console.log(error)
	}
	debug.stopWatching()
})

var getOraclizeCost = () => youTubeToken.getOraclizeFee()
	.then(fee => { console.log("Oraclize Fee: " + fee); return fee })

var addUsersSubscriptions = (user, oraclizeFee) => {
	watchForSubscription()
	debugQuery()
	// Should be 0.0001      value: web3.toWei(0.02, 'ether')
	youTubeToken.registerUser(user, web3.eth.accounts[2], { value: oraclizeFee })
		.then(tx => console.log("Requested subscriptions to be added for user: " + user))
}

var displaySubscriptionCount = (user) => youTubeToken.balanceOf(user)
	.then(result => console.log("SubscriberCount for user " + user + ": " + result))



// youTubeToken.test().then(defAddr => console.log(defAddr))

addUsersSubscriptions("expovistaTV", 0)
// addUsersSubscriptions("GeriGFX", 0)

// getOraclizeCost().then(fee => addUsersSubscriptions("GeriGFX", fee))
// getOraclizeCost().then(fee => addUsersSubscriptions("epicenterbtc", fee))



// displaySubscriptionCount("GeriGFX")

// youTubeToken.totalSupply()
// 	.then(totalSupply => console.log("Total Supply: " + totalSupply.toNumber()))

module.exports = (callback) => {}