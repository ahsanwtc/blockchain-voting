const { expectRevert, time } = require('@openzeppelin/test-helpers');

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

  it("should NOT add voters", async function () {
    await expectRevert(
      voting.addVoters([accounts[5]], { from: voter1 }),
      'only admin'
    );
  });

  it('should create a ballot', async () => {
    await voting.createBallot('Ballot 1', ['choice 1', 'choice 2', 'choice 3'], 5, { from: admin });
    const ballot = await voting.ballots(0);
    await assert(ballot.name === 'Ballot 1');
  });

  it('should NOT create a ballot', async () => {
    await expectRevert(
      voting.createBallot('Ballot 1', ['choice 1', 'choice 2', 'choice 3'], 5, { from: voter2 }),
      'only admin'
    );
  });

  it('should vote', async () => {
    await voting.createBallot('Ballot 2', ['choice 1', 'choice 2', 'choice 3'], 5, { from: admin });
    const ballotId = await voting.nextBallotId() - 1;

    await voting.vote(ballotId, 0, { from: voter1 });
    await voting.vote(ballotId, 2, { from: voter2 });
    await voting.vote(ballotId, 2, { from: voter3 });
    await time.increase(5001);

    
    /* (id, choice, votes), (id, choice, votes), (id, choice, votes) */
    const results = await voting.results(ballotId);
    await assert(results[0].votes === '1');
    await assert(results[1].votes === '0');
    await assert(results[2].votes === '2');
  });
  
  it('should NOT vote if voter is a non voter', async () => {
    await voting.createBallot('Ballot 2', ['choice 1', 'choice 2', 'choice 3'], 5, { from: admin });
    await expectRevert(
      voting.vote(1, 0, { from: nonVoter }),
      'only voters'
    );
  });

  it('should NOT vote if voter already voted', async () => {
    await voting.createBallot('Ballot 3', ['choice 1', 'choice 2', 'choice 3'], 5, { from: admin });
    const ballotId = await voting.nextBallotId() - 1;
    await voting.vote(ballotId, 0, { from: voter1 });
    await expectRevert(
      voting.vote(ballotId, 0, { from: voter1 }),
      "voter has already casted it's vote"
    );
  });

  it('should NOT vote if ballot has ended', async () => {
    await voting.createBallot('Ballot 4', ['choice 1', 'choice 2', 'choice 3'], 5, { from: admin });
    await time.increase(5001);
    await expectRevert(
      voting.vote(2, 0, { from: voter1 }),
      'ballot has already ended'
    );
  });


});
