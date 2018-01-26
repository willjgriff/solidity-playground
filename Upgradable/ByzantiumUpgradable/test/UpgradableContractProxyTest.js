const ContractInterface = artifacts.require("ContractInterface.sol")
const ContractV1 = artifacts.require("ContractV1.sol")
const ContractV2 = artifacts.require("ContractV2.sol")
const UpgradableContractProxy = artifacts.require("UpgradableContractProxy.sol")
// const UpgradableContractProxy = artifacts.require("UpgradableContractProxyAssembly.sol")

contract("UpgradableContractProxy", () => {

    let contractV1, contractV2, upgradableContractProxy, upgradableContract

    beforeEach(async () => {
        contractV1 = await ContractV1.new()
        contractV2 = await ContractV2.new()
        upgradableContractProxy = await UpgradableContractProxy.new(contractV1.address)
        upgradableContract = await ContractInterface.at(upgradableContractProxy.address)
    })

    it("contractV1 returnValue() returns 10", async () => {
        const actualValue = await contractV1.returnValue()
        assert.equal(actualValue, 10)
    })

    describe("returnValue()", () => {

        it("returns 10 using contractV1", async () => {
            const expectedValue = 10
            const actualValue = await upgradableContract.returnValue()

            assert.equal(actualValue.toNumber(), expectedValue)
        })

        it("returns 20 after upgrading to contractV2", async () => {
            const expectedValue = 20
            await upgradableContractProxy.setContractAddress(contractV2.address)
            const actualValue = await upgradableContract.returnValue()

            assert.equal(actualValue, expectedValue)
        })
    })

    describe("setStorageValue()", () => {

        it("sets the storage var", async () => {
            const expectedValue = 5
            await upgradableContract.setStorageValue(expectedValue)
            const actualValue = await upgradableContract.getStorageValue()

            assert.equal(actualValue.toNumber(), expectedValue)
        })

        it("sets the storage var after upgrade", async () => {
            const expectedValue = 5 * 2
            await upgradableContractProxy.setContractAddress(contractV2.address)
            await upgradableContract.setStorageValue(5)
            const actualValue = await upgradableContract.getStorageValue()

            assert.equal(actualValue.toNumber(), expectedValue)
        })
    })

    describe("getDynamicallySizedValue()", () => {

        it("returns expected value from contractV1", async () => {
            const expectedValue = "Hola"
            await upgradableContract.setDynamicallySizedValue(expectedValue)
            const actualValue = await upgradableContract.getDynamicallySizedValue()

            assert.equal(actualValue, expectedValue)
        })
    })

    describe("getUpdatedDynamicallySizedValue()", () => {

        it("returns expected value after upgrading to contractV2", async () => {
            const expectedValue = [0, 1, 2]
            await upgradableContractProxy.setContractAddress(contractV2.address)
            const noInterfaceUpgradableContract = ContractV2.at(upgradableContractProxy.address)

            await noInterfaceUpgradableContract.setDynamicallySizedValue(expectedValue)
            const actualValue = await noInterfaceUpgradableContract.getUpdatedDynamicallySizedValue()

            assert.equal(actualValue.length, 3)
            assert.equal(actualValue[0], expectedValue[0])
            assert.equal(actualValue[1], expectedValue[1])
            assert.equal(actualValue[2], expectedValue[2])
        })
    })
})