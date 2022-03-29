const { expectRevert } = require('@openzeppelin/test-helpers');

const Voting = artifacts.require("Voting");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Voting", function (accounts) {
  let voting = null;
  const [admin, voter1, voter2, voter3, nonVoter] = accounts;

  before(async () => {
    voting = await Voting.deployed();  
  });

  it("should add voters", async function () {
    await voting.addVoters([voter1, voter2, voter3]);
    const results = await Promise.all([voter1, voter2, voter3].map(voter => voting.voters(voter)));
    results.forEach(voter => assert(voter === true));
  });
});
