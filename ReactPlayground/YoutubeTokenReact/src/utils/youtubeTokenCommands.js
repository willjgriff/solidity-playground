import YouTubeToken from '../../build/contracts/SimpleStorage.json'

class YoutubeTokenCommands {

	constructor(web3) {
		const contract = require('truffle-contract')
		this.youtubeToken = contract(YouTubeToken)
		this.youtubeToken.setProvider(web3.currentProvider)
	}

	getOraclizeCost() {
		// return new Promise((resolve, reject) => this.youtubeToken.getOraclizeFee()
		// 	.then(fee => { console.log("Oraclize Fee: " + fee); resolve(fee) }))
		return 5
	}
}

export default YoutubeTokenCommands

// var YouTubeToken = artifacts.require("./YouTubeToken.sol")
// var youTubeToken = YouTubeToken.at(YouTubeToken.address)

// var subscriptionCountUpdatedEvent = youTubeToken.LogBalanceUpdatedWithSubscriptionCount();
// var watchForSubscription = () => subscriptionCountUpdatedEvent.watch((error, response) => {
// 	if (!error) {
// 		console.log("Subscriber: " + response.args.subscriber + " Subscription Count: " + response.args.subscriptionCount)
// 	} else {
// 		console.log(error)
// 	}
// 	subscriptionCountUpdatedEvent.stopWatching()
// })
//
// var debugQuer = youTubeToken.DebugQuery();
// var debugQuery = () => debugQuer.watch((error, response) => {
// 	if (!error) {
// 		console.log("Query: " + response.args.query)
// 	} else {
// 		console.log(error)
// 	}
// 	debugQuer.stopWatching()
// })

// var getOraclizeCost = () => youtubeToken.getOraclizeFee()
// 	.then(fee => { console.log("Oraclize Fee: " + fee); return fee })

// var addUsersSubscriptions = (user, account) => {
// 	watchForSubscription()
// 	debugQuery()
// 	getOraclizeCost()
// 		.then(fee => youTubeToken.registerUser(user, web3.eth.accounts[account], { value: fee }))
// 		.then(tx => console.log("Requested subscriptions to be added for user: " + user))
// }
//
// var balanceOf = account => youTubeToken.balanceOf(web3.eth.accounts[account])
// 	.then(balance => console.log("Account " + account + " balance: " + balance))




// addUsersSubscriptions("expovistaTV", 1)
// addUsersSubscriptions("GeriGFX", 2)

// balanceOf(2)

// youTubeToken.totalSupply()
// 	.then(totalSupply => console.log("Total Supply: " + totalSupply.toNumber()))

// module.exports = {
// 	getOraclizeCost: getOraclizeCost,
	// addUsersSubscriptions: addUsersSubscriptions,
	// balanceOf: balanceOf
// }
