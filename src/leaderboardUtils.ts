import { Result } from "./queries";

type LeaderboardRow = {
  playerName: string;
  matchesWon: number;
  matchesLost: number;
  goalsScored: number;
  goalsConceded: number;
};

export type ExtendedLeaderboardRow = LeaderboardRow & {
  matchesWonPerPlayed: number;
  goalsScoredPerMatch: number;
  goalsConcededPerMatch: number;
  goalDiff: number;
};

export const MIN_MATCHES = 2;

const addResultToRow = (
  row: LeaderboardRow,
  player1Goals: number,
  player2Goals: number
) => {
  const hasWonMatch = player1Goals > player2Goals;
  const matchesWon = row.matchesWon + (hasWonMatch ? 1 : 0);
  const matchesLost = row.matchesLost + (hasWonMatch ? 0 : 1);
  const goalsScored = row.goalsScored + player1Goals;
  const goalsConceded = row.goalsConceded + player2Goals;

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

const toExtendedLeaderboardRow = (
  row: LeaderboardRow
): ExtendedLeaderboardRow => {
  const totalMatches = row.matchesWon + row.matchesLost;

  const goalsScoredPerMatch = row.goalsScored / totalMatches;
  const goalsConcededPerMatch = row.goalsConceded / totalMatches;
  const matchesWonPerPlayed = Math.round((row.matchesWon / totalMatches) * 100);
  const goalDiff = row.goalsScored - row.goalsConceded;
  return {
    ...row,
    matchesWonPerPlayed,
    goalsScoredPerMatch,
    goalsConcededPerMatch,
    goalDiff
  };
};

export const getLeaderboard = (
  results: readonly Result[]
): readonly ExtendedLeaderboardRow[] => {
  const rowMap: Map<string, LeaderboardRow> = new Map<string, LeaderboardRow>();

  for (const result of results) {
    // Process Player1
    const player1Row =
      rowMap.get(result.player1.name) || emptyRow(result.player1.name);

    const newPlayer1Row = addResultToRow(
      player1Row,
      result.player1goals,
      result.player2goals
    );
    rowMap.set(result.player1.name, newPlayer1Row);

    // Process Player2
    const player2Row =
      rowMap.get(result.player2.name) || emptyRow(result.player2.name);

    const newPlayer2Row = addResultToRow(
      player2Row,
      result.player2goals,
      result.player1goals
    );
    rowMap.set(result.player2.name, newPlayer2Row);
  }

  return Array.from(rowMap.values()).map(toExtendedLeaderboardRow);
};
