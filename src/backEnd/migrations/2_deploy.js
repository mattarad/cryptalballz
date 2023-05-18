const Prediction = artifacts.require("Prediction");



module.exports = function(deployer) {
  deployer.deploy(Prediction);
};