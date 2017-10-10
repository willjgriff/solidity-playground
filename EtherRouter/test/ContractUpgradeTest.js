const ContractInterface = artifacts.require("./ContractInterface.sol")
const ContractV1 = artifacts.require("./ContractV1.sol")
const ContractV2 = artifacts.require("./ContractV2.sol")
const Resolver = artifacts.require("./Resolver.sol")
const EtherRouter = artifacts.require("./EtherRouter.sol")
const TestUtils = require("../../TestUtils.js")

contract("Contracts adhering to ContractInterface", () => {

    let contractV1, contractV2, resolver, etherRouter, delegationContract

    beforeEach(async () => {
        contractV1 = await ContractV1.new()
        contractV2 = await ContractV2.new()
        resolver = await Resolver.new()
        etherRouter = await EtherRouter.new(resolver.address)
        delegationContract = await ContractInterface.at(etherRouter.address)
    })

    describe("testReturnValue()", () => {

        it("returns expected value after registering fallback in resolver", async () => {
            await resolver.setFallback(contractV1.address)
            const testReturnValue = await delegationContract.testReturnValue()

            assert.equal(testReturnValue.toNumber(), 10, "Returned test value is not as expected")
        })

        it("returns expected value after registration in resolver", async () => {
            await resolver.register("testReturnValue()", contractV1.address, 32)
            const testReturnValue = await delegationContract.testReturnValue()

            assert.equal(testReturnValue.toNumber(), 10, "Returned test value is not as expected")
        })

        it("returns expected value after registration update in resolver", async () => {
            await resolver.register("testReturnValue()", contractV1.address, 32)
            await resolver.register("testReturnValue()", contractV2.address, 32)
            const testReturnValue = await delegationContract.testReturnValue()

            assert.equal(testReturnValue.toNumber(), 20, "Returned test value is not as expected")
        })
    })

    describe("setStorageValue(uint value)", () => {

        it("sets storage value as expected", async () => {
            const expectedStorageValue = 5;
            await resolver.register("setStorageValue(uint256)", contractV1.address, 0)
            await resolver.register("getStorageValue()", contractV1.address, 32)
            await delegationContract.setStorageValue(expectedStorageValue)
            const actualStorageValue = await delegationContract.getStorageValue()

            assert.equal(actualStorageValue.toNumber(), expectedStorageValue, "Test storage value is not as expected")
        })

        it("set storage value to as expected after update", async () => {
            const expectedStorageValue = 5;
            await resolver.register("setStorageValue(uint256)", contractV1.address, 0)
            await resolver.register("getStorageValue()", contractV1.address, 32) // We don't have to update this if it doesn't change.
            await resolver.register("setStorageValue(uint256)", contractV2.address, 0)
            await delegationContract.setStorageValue(expectedStorageValue)
            const actualStorageValue = await delegationContract.getStorageValue()

            assert.equal(actualStorageValue.toNumber(), expectedStorageValue * 2, "Test storage value is not as expected")
        })
    })

})