var IpfsTest = artifacts.require("./IpfsTest.sol");

module.exports = deployer => {
  deployer.deploy(IpfsTest)
}
