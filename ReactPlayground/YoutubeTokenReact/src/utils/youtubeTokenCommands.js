import YoutubeToken from '../../build/contracts/YouTubeToken.json'
import Rx from 'rxjs/Rx'

class YoutubeTokenCommands {

	constructor(web3) {
		const contract = require('truffle-contract')
		const youtubeToken = contract(YoutubeToken)
		youtubeToken.setProvider(web3.currentProvider)

		this.web3 = web3
		this.youtubeContract = Rx.Observable
			.fromPromise(youtubeToken.deployed())
			.shareReplay(1)
	}

	getAccounts() {
		return Rx.Observable
			.from(this.web3.eth.accounts)
			.do(account => console.log(account))
	}

	getOraclizeCost() {
		return this.youtubeContract
			.flatMap(youtubeContract => youtubeContract.getOraclizeFee())
			.map(oraclizeFeeBigNumber => oraclizeFeeBigNumber.toNumber())
			.do(oraclizeFee => console.log(oraclizeFee))
	}

	getBalanceOf(account) {
		return this.youtubeContract
			.flatMap(youtubeContract => youtubeContract.balanceOf(account))
			.map(balanceBigNumber => balanceBigNumber.toNumber())
			.do(balance => console.log("Account: " + account + " Balance: " + balance))
	}

	addUserSubscriptionCount(user, account) {
		return this.youtubeContract
			// TODO: value needs rejigging.
			.flatMap(youtubeContract => youtubeContract.registerUser(user, account,
				{ from: account, value: this.web3.toWei(0.01, 'ether'), gas: 300000 }))
			.map(tx => tx.tx)
			.do(txHash => console.log("Submitted user registration tx: " + txHash))
	}

}

export default YoutubeTokenCommands



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




// youTubeToken.totalSupply()
// 	.then(totalSupply => console.log("Total Supply: " + totalSupply.toNumber()))
