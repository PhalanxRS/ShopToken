const MyToken = artifacts.require("../Contracts/Token.sol");

module.exports = function (deployer) {
  deployer.deploy(MyToken, "Or the best", "OTB", 10**15);
};