const ArrayLib = artifacts.require("./ArrayLib.sol")
const ArrayLibHarness = artifacts.require("./ArrayLibHarness.sol")
const TestUtils = require("../../../../../Utils/TestUtils")

contract("ArrayLib", accounts => {

    let arrayLibHarness

    beforeEach(async () => {
        ArrayLibHarness.link("ArrayLib", ArrayLib.address)
        arrayLibHarness = await ArrayLibHarness.new()
    })

    describe("removeElement(address[] array, uint position)", () => {

        it("fails if array is empty", async () => {
            const maxGas = 1000000;
            await TestUtils.assertThrows(() => arrayLibHarness.removeElement([], 0), maxGas)
        })

        it("removes element at position 0", async () => {
            const originalArray = [accounts[0], accounts[1]]
            const expectedArray = [accounts[1]]
            const actualArray = await arrayLibHarness.removeElement(originalArray, 0)

            assert.deepEqual(actualArray, expectedArray, "Array is not as expected")
        })

        it("removes element at end of array", async () => {
            const originalArray = [accounts[0], accounts[1], accounts[2]]
            const expectedArray = [accounts[0], accounts[1]]
            const actualArray = await arrayLibHarness.removeElement(originalArray, 2)

            assert.deepEqual(actualArray, expectedArray, "Array is not as expected")
        })

    })
})