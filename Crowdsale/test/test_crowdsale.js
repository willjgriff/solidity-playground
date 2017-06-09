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

		// This currently fails intermittently. I expect because the event doesn't have the
		// chance to fire before the contribute.then() is executed. I'm not sure how to 
		// schedule the .then() until after the event has been fired.
		it("calls Contributed event with correct arguments", () => {
			var expectedSender = accounts[1]
			var expectedContributionAmount = web3.toWei(1, 'ether')
			var eventSender
			var eventContributionAmount

			var event = crowdsale.Contributed({ sender: expectedSender })
			event.watch((error, response) => {
				event.stopWatching()
				eventSender = response.args.sender
				eventContributionAmount = response.args.amount
			})

			return crowdsale.contribute({ from: expectedSender, value: expectedContributionAmount })
				.then(tx => {
					assert.equal(eventSender, expectedSender)
					assert.equal(eventContributionAmount, expectedContributionAmount)
				})
		})

		// Probably shouldn't test this in reality. Would be assumed this works.
		it("doesn't call Contributed event with different index", () => {
			var expectedSender = ""
			var expectedContributionAmount = 0
			var eventSender = ""
			var eventContributionAmount = 0
			
			var event = crowdsale.Contributed({ sender: accounts[1] })
			event.watch((error, response) => {
				eventSender = response.args.sender
				eventContributionAmount = response.args.amount
			})

			return crowdsale.contribute({ from: accounts[2], value: expectedContributionAmount })
				.then(tx => {
					event.stopWatching()
					assert.equal(eventSender, expectedSender)
					assert.equal(eventContributionAmount, expectedContributionAmount)
				})
		})
	})
})