"use strict"

var Crowdsale = artifacts.require('./Crowdsale.sol')

contract("Crowdsale", (accounts) => {
	var crowdsale = null

	var campaignAmount = web3.toWei(2, 'ether')
	var campaignDuration = 60 * 60 * 2 // 2 hours
	var creator = accounts[0]

	beforeEach(() => {
		return Crowdsale.new(campaignAmount, campaignDuration, { from: creator })
			.then(instance => crowdsale = instance)
	})

	describe("contribute", () => {

		// var event = null

		// beforeEach(() => {
		// 	event = crowdsale.Contributed({ sender: accounts[1] }, (error, response) => {

		// 	})
		// })

		it("calls Contributed event with correct arguments", () => {

			var expectedContributionAmount = web3.toWei(1, 'ether')
			var eventSender
			var eventContributionAmount

			// var event = crowdsale.Contributed({ sender: accounts[1] })
			// event.watch((error, response) => {
			// 	event.stopWatching
			// 	if (!error) {
			// 		eventSender = response.args.sender
			// 		eventContributionAmount = response.args.amount
			// 	}
			// })

			crowdsale.contribute({ from: accounts[1], value: expectedContributionAmount })
				.then(tx => {
					
					var event = crowdsale.Contributed({ sender: accounts[1] })
					event.watch((error, response) => {
						event.stopWatching()
						if (!error) {
							eventSender = response.args.sender
							eventContributionAmount = response.args.amount

							assert.equal(eventSender, accounts[1])
							assert.equal(eventContributionAmount, expectedContributionAmount)

						}
					})

					// assert.equal(eventSender, accounts[1])
					// assert.equal(eventContributionAmount, expectedContributionAmount)
					// done()
				})
		})
	})
})