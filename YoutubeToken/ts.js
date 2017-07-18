var YouTubeToken = artifacts.require("./YouTubeToken.sol")
var youTubeToken = YouTubeToken.at(YouTubeToken.address)

// WATCH FOR SUBSCRIBER COUNT LOG
var subscriptionCountUpdatedEvent = youTubeToken.LogSubscriptionCountUpdated();
var watchForSubscription = () => subscriptionCountUpdatedEvent.watch((error, response) => {
	if (!error) {
		console.log("Subscriber: " + response.args.subscriber + " Subscription Count: " + response.args.subscriptionCount)
	} else {
		console.log(error)
	}
	subscriptionCountUpdatedEvent.stopWatching()
})

var addUsersSubscriptions = user => {
	watchForSubscription()
	// Should be 0.0001
	youTubeToken.addSubscriptionCount(user, { value: web3.toWei(0.0002, 'ether') })
		.then(tx => console.log("Requested subscriptions to be added for user: " + user))
}

addUsersSubscriptions("expovistaTV")
// addUsersSubscriptions("Epicenter")

var debug = youTubeToken.Debug();
debug.watch((error, response) => {
	if (!error) {
		console.log("Query: " + response.args.query)
	} else {
		console.log(error)
	}
	debug.stopWatching()
})


// youTubeToken.subscriptionCount("expovistaTV")
// 	.then(result => console.log(result))

// youTubeToken.totalSupply()
// 	.then(totalSupply => console.log("Total Supply: " + totalSupply.toNumber()))

module.exports = (callback) => {}