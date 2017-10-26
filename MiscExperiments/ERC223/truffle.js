module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8544,
            network_id: "*" // Match any network id
        },
        testnet: {
            host: "localhost",
            port: 8546,
            network_id: "4",
            gas: 4000000,
            gasPrice: 101000000111
        }
    }
};
