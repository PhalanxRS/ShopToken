const MyToken = artifacts.require("../Contracts/Token.sol");

module.exports = function (deployer) {
  deployer.deploy(MyToken, "The Best Token", "TBT", 25);
};