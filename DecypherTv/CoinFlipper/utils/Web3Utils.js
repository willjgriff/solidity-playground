
// Note we need to leave and reopen truffle console if we change this... 
// 'require' caches the js files not sure how to easily prevent this.

// var utils = require("./utils/Web3Utils.js")

var Web3 = require('web3')
// Note we must change the web3 provider port when we change the testnet port.
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var acc = index => web3.eth.accounts[index]

var balance = acct => web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber()
var rawBalance = acct => web3.eth.getBalance(acct).toNumber()
var balances = numberOfAccounts => {
	Array
		.from(Array(numberOfAccounts).keys())
		.map(index => acc(index))
		.forEach(account => console.log(account + " : " + balance(account)))
}

var unlockAccount = (acct, password) => web3.personal.unlockAccount(acct, password, 0);
var unlockAccounts = (numberOfAccounts, password) => {
	return Array
		.from(Array(numberOfAccounts).keys())
		.map(index => acc(index))
		.map(account => unlockAccount(account, password))
		.every(unlocked => true)
}

module.exports = {
	acc: acc,
	balance: balance,
	rawBalance: rawBalance,
	balances: balances,
	unlockAccount: unlockAccount,
	unlockAccounts: unlockAccounts,
	weiToEther: wei => web3.fromWei(wei, 'ether'),
	etherToWei: ether => web3.toWei(ether, 'ether'),
	gweiToWei: gwei => web3.toWei(gwei, 'gwei')
}