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

    it("doStandardDelegateCall() updates var in calling contract and not in called contract", async () => {
        const delegateToContract = await DelegateToContract.new()
        await assemblyExperiment.doStandardDelegateCall(delegateToContract.address, "updateStorageVar()")
        const delegateToContractVar = await delegateToContract.updateByDelegate()
        const assemblyExperimentVar = await assemblyExperiment.updateByDelegate()

        assert.equal(delegateToContractVar.toNumber(), 0)
        assert.equal(assemblyExperimentVar.toNumber(), 321)
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

    it("stringToBytes32() returns correct bytes32", async () => {
        const stringBytes32 = await assemblyExperiment.stringToBytes32("Hola")
        assert.equal(stringBytes32, "0x486f6c6100000000000000000000000000000000000000000000000000000000")
    })
})