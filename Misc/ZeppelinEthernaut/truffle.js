const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = "your metamask mnemonic here";
const infuraKey = "your infura api key here"

module.exports = {
    networks: {
        ropsten: {
            provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infuraKey),
            network_id: 3,
            gas: 4000000
        },
        development: {
            host: "localhost",
            port: 8544,
            network_id: "*", // Match any network id
            gas: 4000000
        }
    }
}


