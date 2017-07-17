var YouTubeToken = artifacts.require("./YouTubeToken.sol")
var youTubeToken = YouTubeToken.at(YouTubeToken.address)

// WATCH FOR SUBSCRIBER COUNT LOG
var subscriptionCountUpdatedEvent = youTubeToken.LogSubscriptionCountUpdated();
subscriptionCountUpdatedEvent.watch((error, response) => {
	if (!error) {
		console.log("Subscriber: " + response.args.subscriber + " Subscription Count: " + response.args.subscriptionCount)
	} else {
		console.log(error)
	}
	subscriptionCountUpdatedEvent.stopWatching()
})

youTubeToken.addSubscriptionCount("expovistaTV", "APIKEY")
	.then(tx => console.log(tx))

// youTubeToken.subscriptionCount("expovistaTV")
// 	.then(result => console.log(result))

module.exports = (callback) => {}