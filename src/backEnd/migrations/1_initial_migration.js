var Migrations = artifacts.require("Migrations");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(Migrations);
};
