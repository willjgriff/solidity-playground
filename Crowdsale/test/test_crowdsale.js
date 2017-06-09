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

		it("calls Contributed event with correct arguments", () => {
			var expectedSender = accounts[1]
			var expectedContributionAmount = web3.toWei(1, 'ether')
			var eventSender
			var eventContributionAmount

			var event = crowdsale.Contributed({ sender: expectedSender })
			event.watch((error, response) => {
				eventSender = response.args.sender
				eventContributionAmount = response.args.amount
			})

			return crowdsale.contribute({ from: expectedSender, value: expectedContributionAmount })
				.then(tx => {
					event.stopWatching()
					assert.equal(eventSender, expectedSender)
					assert.equal(eventContributionAmount, expectedContributionAmount)
				})
		})
	})
})