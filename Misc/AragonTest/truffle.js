module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8544,
            network_id: "*", // Match any network id
            gas: 4000000,
            gasPrice: 21000000000
        }
    }
}
