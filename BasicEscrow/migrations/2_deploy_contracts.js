var Escrow = artifacts.require("Escrow.sol")

module.exports = function(deployer) {
  deployer.deploy(Escrow, web3.eth.accounts[1], web3.eth.accounts[2]);
};