// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Voting {
    address public admin;
    mapping(address => bool) public voters;    
    struct Choice {
        uint id;
        string name;
        uint votes;
    }
    struct Ballot {
        uint id;
        string name;
        Choice[] choices;
        uint end;
    }
    mapping(uint => Ballot) public ballots;
    uint nextBallotId;
    mapping(address => mapping(uint => bool)) public votes;

    constructor() {
        admin = msg.sender;
    }

    function addVoters(address[] calldata _voters) external onlyAdmin() {
        for (uint i = 0; i < _voters.length; i++) {
            voters[_voters[i]] = true;
        }
    }

    function createBallot(string calldata name, string[] calldata choices, uint offset) external onlyAdmin() {
        ballots[nextBallotId].id = nextBallotId;
        ballots[nextBallotId].name = name;
        ballots[nextBallotId].end = block.timestamp + offset;
        for (uint i = 0; i < choices.length; i++) {
            ballots[nextBallotId].choices.push(Choice(i, choices[i], 0));
        }
    }

    function vote(uint ballotId, uint choiceId) external {
        require(voters[msg.sender] == true, "only voters");
        require(votes[msg.sender][ballotId] == false, "voter has already casted it's vote");
        require(block.timestamp < ballots[ballotId].end, "ballot has already ended");
        votes[msg.sender][ballotId] = true;
        ballots[ballotId].choices[choiceId].votes++;
    }

    function results(uint ballotId) view external returns(Choice[] memory) {
        require(block.timestamp >= ballots[ballotId].end, "ballot is still active");
        return ballots[ballotId].choices;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

}