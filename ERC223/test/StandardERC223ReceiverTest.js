const ExampleERC223Receiver = artifacts.require("ExampleERC223Receiver.sol")
const TestUtils = require("../../TestUtils.js")

// To get encoded function call data in truffle do
// Contract.deployed().then(inst => inst.contract.functionCall.getData([params if any]))
contract("StandardERC23Receiver", accounts => {

    let exampleReceiver

    beforeEach(async () => {
        exampleReceiver = await ExampleERC223Receiver.new()
    })

    describe("tokenFallback(address originalCaller, address from, uint value, bytes data)", () => {

        let originalCaller = "0x6872f5f8725868b1df9bd0e5578f34404b965f25"
        let from = "0x2db9672f4a5baec2b777a8de375c51ddc3b1723d"
        let value = 1000;

        it("calls fallback function on implementing contract", async () => {
            const unknownFunctionSignature = "0x00000000" // Should call fallback function
            const tx = await exampleReceiver.tokenFallback(originalCaller, from, value, unknownFunctionSignature)

            TestUtils.assertEventFired(tx, "LogFallbackCalled")
        })

        it("calls test function on implementing contract", async () => {
            const testFunctionSignature =  exampleReceiver.contract.test.getData()
            const tx = await exampleReceiver.tokenFallback(originalCaller, from, value, testFunctionSignature)

            TestUtils.assertEventFired(tx, "LogTestCalled")
        })

        it("calls testWithArg function on implementing contract with correct uint argument", async () => {
            const expectedArgument = 10;
            const encodedFunctionCall = exampleReceiver.contract.testWithArg.getData(expectedArgument)
            await exampleReceiver.tokenFallback(originalCaller, from, value, encodedFunctionCall)
            const logArguments = await TestUtils.listenForEvent(exampleReceiver.LogTestWithArg())

            assert.equal(logArguments.testArg, expectedArgument, "Argument passed to function is not as expected")
        })

        it("calls testWithTempToken function on implementing contract with correct tempToken values", async () => {
            const encodedFunctionCall = exampleReceiver.contract.testWithTempToken.getData()
            await exampleReceiver.tokenFallback(originalCaller, from, value, encodedFunctionCall)
            const logArguments = await TestUtils.listenForEvent(exampleReceiver.LogTestWithTempTransfer())

            assert.equal(logArguments.tokenFallbackCaller, accounts[0], "Token fallback caller is not as expected")
            assert.equal(logArguments.originalCaller, originalCaller, "Original caller is not as expected")
            assert.equal(logArguments.from, from, "From address is not as expected")
            assert.equal(logArguments.value, value, "Value is not as expected")
            assert.equal(logArguments.data, encodedFunctionCall, "Data is not as expected")
        })
    })
})