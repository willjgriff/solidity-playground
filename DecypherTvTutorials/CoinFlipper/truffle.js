module.exports = {
  	networks: {

		testrpc: {
	  		host: "localhost",
	  		port: 8545,
	  		network_id: "*", // Match any network id
		},

		rinkeby: {
			host: "localhost",
			port: 8544,
			network_id: "4",
			// The default gas is larger than Rinkeby's general gas limit so we specify it explicitly here. 
			// Generally I have specified gas explicitly when tx's are made.
			// I'm not sure how it can be specified for migration tx's though.
			// I wonder if when at max (4.71m) there's risk tx's will be ignored as a miner may only 
			// include one tx per block which probably won't actually get them the full gas amount.
			gas: 3000000, 
			gasPrice: 20000000111 // The random gasPrice helps pick out tx's in txpool
		}
	}
};
