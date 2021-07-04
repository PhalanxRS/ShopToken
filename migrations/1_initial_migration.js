const MyToken = artifacts.require("../Contracts/Token.sol");

module.exports = function (deployer) {
  deployer.deploy(MyToken, "Phalanx The Best", "PTB", 25);
};