
const MetaTxProxy = artifacts.require("MetaTxProxy")
const ECTools = artifacts.require("ECTools")

contract("MetaTxProxy", accounts => {

    let metaTxProxy, ecTools
    const signingAccount = accounts[1]

    beforeEach(async () => {
        ecTools = await ECTools.new()
        MetaTxProxy.link("ECTools", ecTools.address)
        metaTxProxy = await MetaTxProxy.new()
    })

    describe("getSigner(address signature)", () => {

        it("returns expected address as the signer", async () => {
            const hashToSign = await metaTxProxy.getHashOf()
            console.log("Hash to sign: " + hashToSign)

            const signatureOfHash = await web3.eth.sign(hashToSign, signingAccount)
            console.log("Sig of hash: " + signatureOfHash)

            const signer = await metaTxProxy.getSigner(hashToSign, signatureOfHash)
            console.log("Signer: " + signer)

            assert.equal(signer, signingAccount)
        })
    })
})