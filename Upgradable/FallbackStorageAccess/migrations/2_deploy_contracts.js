
const FallbackFuncContract = artifacts.require("FallbackFuncContract.sol")

module.exports = function (deployer) {
    deployer.deploy(FallbackFuncContract)
}
