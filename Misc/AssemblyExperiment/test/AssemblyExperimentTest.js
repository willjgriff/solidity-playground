const AssemblyExperiment = artifacts.require("AssemblyExperiment.sol")

contract("AssemblyExperiment", accounts => {

    let assemblyExperiment;

    beforeEach(async () => assemblyExperiment = await AssemblyExperiment.new())

    describe("getFunctionSig()", () => {

        it("returns correct signature", async () => {
            const functionSig = await assemblyExperiment.getFunctionSig()
            assert.equal(functionSig, "0x7f47a1c2")
        })
    })

    describe("getMemory()", () => {

        it("gets memory at top of memory", async () => {
            const memory = await assemblyExperiment.getMemory()
            assert.equal(memory, 1)
        })
    })
})