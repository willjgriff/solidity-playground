const SignatureVerifier = artifacts.require("SignatureVerifier")
const EcTools = artifacts.require("EcTools")

contract("SignatureVerifier", accounts => {

    let signatureVerifier
    const randomAddress = accounts[0]
    const signingAccount = accounts[1]

    beforeEach(async () => {
        ecTools = await EcTools.new()
        SignatureVerifier.link("EcTools", ecTools.address)
        signatureVerifier = await SignatureVerifier.new()
    })

    it("verifyHardCoded() verifies correct structured data signature", async () => {
        const verified = await signatureVerifier.verifyHardCoded()
        assert.isTrue(verified)
    })

    it("verifySpecific() verifies correct structured data signature", async () => {
        const bid = { amount: 1, bidder: { userId: 1, wallet: randomAddress } }
        const bidHash = await signatureVerifier.hashBid(bid, {})
        const signature = await web3.eth.sign(bidHash, signingAccount)

        const signatureAddress = await signatureVerifier.verifySpecific(bid, signature, {})

        assert.equal(signatureAddress, signingAccount)
    })
})