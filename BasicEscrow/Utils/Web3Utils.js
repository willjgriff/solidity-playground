
// Note we need to leave and reopen truffle console if we change this... 
// require caches the js files not sure how to easily prevent this.

var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var balance = (acct) => { return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() };
var rawBalance = (acct) => { return web3.eth.getBalance(acct).toNumber() }

module.exports = {
	balance: balance,
	rawBalance: rawBalance,
	bal0: () => balance(web3.eth.accounts[0]),
	bal1: () => balance(web3.eth.accounts[1]),
	bal2: () => balance(web3.eth.accounts[2]),
	accounts: web3.eth.accounts,
	weiToEther: (wei) => { return web3.fromWei(wei, 'ether') },
	etherToWei: (ether) => { return web3.toWei(ether, 'ether') },
	gweiToWei: (gwei) => { return web3.toWei(gwei, 'gwei') }
}