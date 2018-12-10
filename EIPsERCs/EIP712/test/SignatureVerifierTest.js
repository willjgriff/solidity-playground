const SignatureVerifier = artifacts.require("SignatureVerifier")
const EcTools = artifacts.require("EcTools")

contract("SignatureVerifier", accounts => {

    let signatureVerifier
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

    it("verifySpecificWithPrefix() verifies correct structured data signature", async () => {
        const bidMessage = { amount: 100, bidder: { userId: 323, wallet: "0x3333333333333333333333333333333333333333" } }
        const bidHash = await signatureVerifier.hashBid(bidMessage, {})
        const signature = await web3.eth.sign(bidHash, signingAccount)

        const signatureAddress = await signatureVerifier.verifySpecificWithPrefix(bidMessage, signature, {})

        assert.equal(signatureAddress, signingAccount)
    })

    it("verifySpecificWithoutPrefix() verifies correct structured data signature hashed using web3", async () => {

        const domain = [
            {name: "name", type: "string"},
            {name: "version", type: "string"},
            {name: "chainId", type: "uint256"},
            {name: "verifyingContract", type: "address"},
            {name: "salt", type: "bytes32"},
        ]

        const bid = [
            {name: "amount", type: "uint256"},
            {name: "bidder", type: "Identity"},
        ]

        const identity = [
            {name: "userId", type: "uint256"},
            {name: "wallet", type: "address"},
        ]

        const domainData = {
            name: "My amazing dApp",
            version: "2",
            chainId: 1,
            verifyingContract: "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070",
            salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
        }

        const bidMessage = {
            amount: 100,
            bidder: {
                userId: 323,
                wallet: "0x3333333333333333333333333333333333333333"
            }
        }

        const data = {
            types: {
                EIP712Domain: domain,
                Bid: bid,
                Identity: identity,
            },
            domain: domainData,
            primaryType: "Bid",
            message: bidMessage
        }

        const signTypedData = async function (account, data) {
            return new Promise(function (resolve, reject) {
                web3.currentProvider.send({
                    jsonrpc: "2.0",
                    method: "eth_signTypedData",
                    params: [account, data],
                    id: 1,
                    from: account
                }, function (err, response) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(response.result);
                });
            });
        }

        const signature = await signTypedData(signingAccount, data)

        const signatureAddress = await signatureVerifier.verifySpecificWithoutPrefix(bidMessage, signature, {})

        assert.equal(signatureAddress, signingAccount)
    })
})