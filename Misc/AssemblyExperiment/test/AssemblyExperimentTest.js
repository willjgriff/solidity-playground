const AssemblyExperiment = artifacts.require("AssemblyExperiment.sol")
const DelegateToContract = artifacts.require("DelegateToContract.sol")

contract("AssemblyExperiment", accounts => {

    let assemblyExperiment;

    beforeEach(async () => assemblyExperiment = await AssemblyExperiment.new())

    it("getFunctionSig() returns correct signature", async () => {
        const functionSig = await assemblyExperiment.getFunctionSig()
        assert.equal(functionSig, "0x7f47a1c2")
    })

    it("getMemory() gets memory at top of memory", async () => {
        const memory = await assemblyExperiment.getMemory()
        assert.equal(memory, 96)
    })

    it("doAssemblyDelegateCall() returns value from delegate to contract function call", async () => {
        const delegateToContract = await DelegateToContract.new();
        const delegatedFunctionResult = await assemblyExperiment.doAssemblyDelegateCall(delegateToContract.address, "get32ByteValue()")
        assert.equal(delegatedFunctionResult, 123)
    })

    it("getFunctionSigBytes() returns correct signature", async () => {
        const functionSig = await assemblyExperiment.getFunctionSigBytes("getFunctionSig()")
        assert.equal(functionSig, "0x7f47a1c2")
    })

    describe("byte tests", () => {

        it("testBytes1()", async () => {
            const bytes1 = await assemblyExperiment.testBytes1()
            assert.equal(bytes1, "0x12")
        })

        it("testByteArray()", async () => {
            const byteArray = await assemblyExperiment.testByteArray()
            assert.deepEqual(byteArray, ["0x12"])
        })
    })
})