const Voting = artifacts.require('Voting');

module.exports = function(_deployer, _network, accounts) {
  _deployer.deploy(Voting);
};
