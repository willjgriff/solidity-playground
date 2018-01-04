module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8544,
            network_id: "*", // Match any network id
            gas: 4000000,
            gasPrice: 21000000000
        },
        kovan: {
            host: "localhost",
            port: 8548, // might be 8547
            network_id: "*",
            gas: 5000000,
            gasPrice: 50000000000
        },
        rinkeby: {
            host: "localhost",
            port: 8549, // might be 8547
            network_id: "*",
            gas: 5000000,
            gasPrice: 50000000000
        }
    }
}
