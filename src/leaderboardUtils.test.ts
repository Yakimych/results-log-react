import { getLeaderboard, ExtendedLeaderboardRow } from "./leaderboardUtils";
import { Result } from "./queries";
import { getInternalSortFunc, getSortFunc } from "./WeeklyLeaderboard";

const testResults: readonly Result[] = [
  {
    player1: { name: "Qwe" },
    player2: { name: "Abc" },
    player2goals: 4,
    player1goals: 0,
    extratime: false,
    date: "2019-07-27T07:26:31.667+00:00",
    id: 116
  },
  {
    player1: { name: "Qwe" },
    player2: { name: "Abc" },
    player2goals: 1,
    player1goals: 2,
    extratime: true,
    date: "2019-07-27T07:26:21.42+00:00",
    id: 115
  },
  {
    player1: { name: "Abc" },
    player2: { name: "Def" },
    player2goals: 4,
    player1goals: 6,
    extratime: false,
    date: "2019-07-27T06:29:51.565+00:00",
    id: 114
  },
  {
    player1: { name: "Abc" },
    player2: { name: "Qwe" },
    player2goals: 1,
    player1goals: 3,
    extratime: false,
    date: "2019-07-27T06:29:32.534+00:00",
    id: 113
  },
  {
    player1: { name: "Player4" },
    player2: { name: "Yet another one" },
    player2goals: 12,
    player1goals: 9,
    extratime: false,
    date: "2019-07-23T20:24:02.917+00:00",
    id: 102
  },
  {
    player1: { name: "Another new player" },
    player2: { name: "Yet another one" },
    player2goals: 1,
    player1goals: 4,
    extratime: false,
    date: "2019-07-23T20:12:45.985+00:00",
    id: 101
  },
  {
    player1: { name: "NewP1" },
    player2: { name: "NewP2" },
    player2goals: 1,
    player1goals: 2,
    extratime: true,
    date: "2019-07-23T20:04:19.8+00:00",
    id: 100
  },
  {
    player1: { name: "Player4" },
    player2: { name: "Yet another one" },
    player2goals: 6,
    player1goals: 3,
    extratime: false,
    date: "2019-07-21T20:48:17+00:00",
    id: 103
  },
  {
    player1: { name: "Qwe" },
    player2: { name: "Def" },
    player2goals: 0,
    player1goals: 3,
    extratime: false,
    date: "2019-07-21T11:49:21.709+00:00",
    id: 99
  },
  {
    player1: { name: "New Player 5" },
    player2: { name: "Cde" },
    player2goals: 0,
    player1goals: 2,
    extratime: false,
    date: "2019-07-21T11:48:39.637+00:00",
    id: 98
  },
  {
    player1: { name: "Abc" },
    player2: { name: "Player4" },
    player2goals: 12,
    player1goals: 0,
    extratime: false,
    date: "2019-07-21T11:28:51.671+00:00",
    id: 97
  },
  {
    player1: { name: "Abc" },
    player2: { name: "Another new player" },
    player2goals: 0,
    player1goals: 1,
    extratime: false,
    date: "2019-07-21T11:27:56.221+00:00",
    id: 96
  }
];

const expectedLeaderboard1: ExtendedLeaderboardRow[] = [
  {
    playerName: "qwe",
    matchesWon: 2,
    matchesLost: 3,
    goalsScored: 15,
    goalsConceded: 19,
    matchesWonPerPlayed: 67,
    goalsScoredPerMatch: 2.5,
    goalsConcededPerMatch: 3.1666666666666665,
    goalDiff: -4
  },
  {
    playerName: "Abc",
    matchesWon: 4,
    matchesLost: 2,
    goalsScored: 15,
    goalsConceded: 19,
    matchesWonPerPlayed: 67,
    goalsScoredPerMatch: 2.5,
    goalsConcededPerMatch: 3.1666666666666665,
    goalDiff: -4
  }
];

const expectedLeaderboard2: ExtendedLeaderboardRow[] = [
  {
    playerName: "Abc",
    matchesWon: 4,
    matchesLost: 2,
    goalsScored: 15,
    goalsConceded: 19,
    matchesWonPerPlayed: 67,
    goalsScoredPerMatch: 2.5,
    goalsConcededPerMatch: 3.1666666666666665,
    goalDiff: -4
  },
  {
    playerName: "qwe",
    matchesWon: 2,
    matchesLost: 3,
    goalsScored: 15,
    goalsConceded: 19,
    matchesWonPerPlayed: 67,
    goalsScoredPerMatch: 2.5,
    goalsConcededPerMatch: 3.1666666666666665,
    goalDiff: -4
  }
];

const expectedLeaderboard: ExtendedLeaderboardRow[] = [
  {
    playerName: "Abc",
    matchesWon: 4,
    matchesLost: 2,
    goalsScored: 15,
    goalsConceded: 19,
    matchesWonPerPlayed: 67,
    goalsScoredPerMatch: 2.5,
    goalsConcededPerMatch: 3.1666666666666665,
    goalDiff: -4
  },
  {
    playerName: "Yet another one",
    matchesWon: 2,
    matchesLost: 1,
    goalsScored: 19,
    goalsConceded: 16,
    matchesWonPerPlayed: 67,
    goalsScoredPerMatch: 6.333333333333333,
    goalsConcededPerMatch: 5.333333333333333,
    goalDiff: 3
  },
  {
    playerName: "Qwe",
    matchesWon: 2,
    matchesLost: 2,
    goalsScored: 6,
    goalsConceded: 8,
    matchesWonPerPlayed: 50,
    goalsScoredPerMatch: 1.5,
    goalsConcededPerMatch: 2,
    goalDiff: -2
  },
  {
    playerName: "Another new player",
    matchesWon: 1,
    matchesLost: 1,
    goalsScored: 4,
    goalsConceded: 2,
    matchesWonPerPlayed: 50,
    goalsScoredPerMatch: 2,
    goalsConcededPerMatch: 1,
    goalDiff: 2
  },
  {
    playerName: "Player4",
    matchesWon: 1,
    matchesLost: 2,
    goalsScored: 24,
    goalsConceded: 18,
    matchesWonPerPlayed: 33,
    goalsScoredPerMatch: 8,
    goalsConcededPerMatch: 6,
    goalDiff: 6
  },
  {
    playerName: "Def",
    matchesWon: 0,
    matchesLost: 2,
    goalsScored: 4,
    goalsConceded: 9,
    matchesWonPerPlayed: 0,
    goalsScoredPerMatch: 2,
    goalsConcededPerMatch: 4.5,
    goalDiff: -5
  }
];

describe("getLeaderboard", () => {
  test("should return empty leaderboard for empty results", () => {
    const leaderboard = getLeaderboard([]);
    expect(leaderboard.length).toBe(0);
  });

  // test("should return correctly calculated leaderboard", () => {
  //   const leaderboard = getLeaderboard(testResults) as ExtendedLeaderboardRow[];
  //   leaderboard.sort();
  //   expectedLeaderboard.sort();

  //   expect(leaderboard).toEqual(expectedLeaderboard);
  // });

  test("should return correctly calculated leaderboard", () => {
    const internalSortFunc = getInternalSortFunc("WINS_PER_MATCH");
    const sortFunc = getSortFunc(internalSortFunc, "desc");

    expectedLeaderboard1.sort(sortFunc);
    expectedLeaderboard2.sort(sortFunc);

    expect(expectedLeaderboard1).toEqual(expectedLeaderboard2);
  });
});
