import { Result } from "./queries";

type LeaderboardRow = {
  playerName: string;
  matchesWon: number;
  // matchesWonPerPlayed: number;
  matchesLost: number;
  goalsScored: number;
  // goalsScoredPerMatch: number;
  goalsConceded: number;
  // goalsConcededPerMatch: number;
  // goalsDiff: number;
};

export const MIN_MATCHES = 2;

const addPlayer1ResultToRow = (row: LeaderboardRow, result: Result) => {
  const hasWonMatch = result.player1goals > result.player2goals;
  const matchesWon = row.matchesWon + (hasWonMatch ? 1 : 0);
  const matchesLost = row.matchesLost + (hasWonMatch ? 0 : 1);
  const goalsScored = row.goalsScored + result.player1goals;
  const goalsConceded = row.goalsConceded + result.player2goals;

  return {
    ...row,
    matchesWon,
    matchesLost,
    goalsScored,
    goalsConceded
  };
};

const addPlayer2ResultToRow = (row: LeaderboardRow, result: Result) => {
  const hasWonMatch = result.player2goals > result.player1goals;
  const matchesWon = row.matchesWon + (hasWonMatch ? 1 : 0);
  const matchesLost = row.matchesLost + (hasWonMatch ? 0 : 1);
  const goalsScored = row.goalsScored + result.player2goals;
  const goalsConceded = row.goalsConceded + result.player1goals;

  return {
    ...row,
    matchesWon,
    matchesLost,
    goalsScored,
    goalsConceded
  };
};

const emptyRow = (playerName: string): LeaderboardRow => ({
  playerName,
  matchesWon: 0,
  matchesLost: 0,
  goalsScored: 0,
  goalsConceded: 0
});

export const getLeaderboard = (
  results: readonly Result[]
): readonly LeaderboardRow[] => {
  const rowMap: Map<string, LeaderboardRow> = new Map<string, LeaderboardRow>();

  for (const result of results) {
    // Player1
    const player1Row =
      rowMap.get(result.player1.name) || emptyRow(result.player1.name);

    const newPlayer1Row = addPlayer1ResultToRow(player1Row, result);
    rowMap.set(result.player1.name, newPlayer1Row);

    // Player2
    const player2Row =
      rowMap.get(result.player2.name) || emptyRow(result.player2.name);

    const newPlayer2Row = addPlayer2ResultToRow(player2Row, result);
    rowMap.set(result.player2.name, newPlayer2Row);
  }

  return Array.from(rowMap.values());
};
