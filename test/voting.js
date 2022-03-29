const Voting = artifacts.require("Voting");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Voting", function (/* accounts */) {
  let voting = null;
  
  before(async () => {
    voting = await Voting.deployed();  
  });

  it("should assert true", async function () {
    await Voting.deployed();
    return assert.isTrue(true);
  });
});
