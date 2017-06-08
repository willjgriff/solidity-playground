module.exports = {
  networks: {

    testrpc: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
    	host: "localhost",
    	port: 8544,
    	network_id: "4",
    	gas: 4700000,
    	gasPrice: 20000000111
    }
  }
};
