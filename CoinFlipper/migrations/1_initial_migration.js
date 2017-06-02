var Migrations = artifacts.require("./Migrations.sol");

module.exports = (deployer) => {
	// gas defined is rough estimate
	deployer.deploy(Migrations, { gas: 200000 });
};
