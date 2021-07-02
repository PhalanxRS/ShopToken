const MyToken = artifacts.require("../Contracts/TokenFlat2.sol");

module.exports = function (deployer) {
  deployer.deploy(MyToken, "Phalanx The Best", "PTB", 10**15);
};