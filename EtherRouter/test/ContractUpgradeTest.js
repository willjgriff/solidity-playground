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

    describe("returnValue()", () => {

        it("returns expected value after registering fallback in resolver", async () => {
            await resolver.setFallback(contractV1.address)
            const testReturnValue = await delegationContract.returnValue()

            assert.equal(testReturnValue.toNumber(), 10, "Returned test value is not as expected")
        })

        it("returns expected value after registration in resolver", async () => {
            await resolver.register("returnValue()", contractV1.address, 32)
            const testReturnValue = await delegationContract.returnValue()

            assert.equal(testReturnValue.toNumber(), 10, "Returned test value is not as expected")
        })

        it("returns expected value after registration update in resolver", async () => {
            await resolver.register("returnValue()", contractV1.address, 32)
            await resolver.register("returnValue()", contractV2.address, 32)
            const testReturnValue = await delegationContract.returnValue()

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

        it("sets storage value to as expected after update", async () => {
            const expectedStorageValue = 5;
            await resolver.register("setStorageValue(uint256)", contractV1.address, 0)
            await resolver.register("getStorageValue()", contractV1.address, 32) // We don't have to update this if it doesn't change.
            await resolver.register("setStorageValue(uint256)", contractV2.address, 0)
            await delegationContract.setStorageValue(expectedStorageValue)
            const actualStorageValue = await delegationContract.getStorageValue()

            assert.equal(actualStorageValue.toNumber(), expectedStorageValue * 2, "Test storage value is not as expected")
        })
    })

    describe("getDynamicallySizedValue()", () => {

        it("returns the expected value after registering appropriate functions with the resolver", async () => {
            const expectedDynamicVar = "Hola Papi"
            await resolver.register("setDynamicallySizedValue(string)", contractV1.address, 0)
            await resolver.register("getDynamicallySizedValue()", contractV1.address, 0)
            await resolver.registerLengthFunction("getDynamicallySizedValue()", "getDynamicallySizedValueSize()", contractV1.address)
            await delegationContract.setDynamicallySizedValue(expectedDynamicVar)
            const actualDynamicVar = await delegationContract.getDynamicallySizedValue()

            assert.equal(actualDynamicVar, expectedDynamicVar, "Dynamically sized return string is not as expected")
        })

        it("returns the expected value after updating to new return type", async () => {
            const expectedDynamicVar = [0, 1, 2]
            await resolver.register("setDynamicallySizedValue(string)", contractV1.address, 0)
            await resolver.register("getDynamicallySizedValue()", contractV1.address, 0)
            await resolver.registerLengthFunction("getDynamicallySizedValue()", "getDynamicallySizedValueSize()", contractV1.address)

            await resolver.register("setDynamicallySizedValue(uint256[])", contractV2.address, 0)
            await resolver.register("getUpdatedDynamicallySizedValue()", contractV2.address, 0)
            await resolver.registerLengthFunction("getUpdatedDynamicallySizedValue()", "getDynamicallySizedValueSize()", contractV2.address)

            // We create a delegation contract as we cannot use the old interface, since the function signatures have changed.
            delegationContract = await ContractV2.at(etherRouter.address)
            await delegationContract.setDynamicallySizedValue(expectedDynamicVar)
            const actualDynamicVar = await delegationContract.getUpdatedDynamicallySizedValue()

            assert.equal(actualDynamicVar.length, 3, "Dynamically sized array is the incorrect size")
            assert.equal(actualDynamicVar[0], expectedDynamicVar[0], "Dynamically sized array index 0 is incorrect")
            assert.equal(actualDynamicVar[1], expectedDynamicVar[1], "Dynamically sized array index 1 is incorrect")
            assert.equal(actualDynamicVar[2], expectedDynamicVar[2], "Dynamically sized array index 2 is incorrect")
        })
    })

})