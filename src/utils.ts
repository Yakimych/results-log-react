import { Result, Player } from "./queries";

export const formatDate = (date: Date) => date.toISOString().substring(0, 10);

export const withCurrentTime = (date: Date) => {
  const dateWithCurrentTime = new Date();
  dateWithCurrentTime.setFullYear(date.getFullYear());
  dateWithCurrentTime.setMonth(date.getMonth());
  dateWithCurrentTime.setDate(date.getDate());
  return dateWithCurrentTime;
};

export const validNumberOfGoals = (goalsString: string) => {
  const goalsNumber = Number(goalsString);
  return isNaN(goalsNumber) ? 0 : Math.max(Math.floor(goalsNumber), 0);
};

type WinningLosingResult = {
  id: number;
  winningPlayer: Player;
  losingPlayer: Player;
  winningGoals: number;
  losingGoals: number;
  date: string;
  extratime: boolean;
};

const toWinningLosingResult = (result: Result): WinningLosingResult => {
  const player1IsWinner = result.player1goals > result.player2goals;
  if (player1IsWinner) {
    return {
      ...result,
      winningPlayer: result.player1,
      winningGoals: result.player1goals,
      losingPlayer: result.player2,
      losingGoals: result.player2goals
    };
  }
  return {
    ...result,
    winningPlayer: result.player2,
    winningGoals: result.player2goals,
    losingPlayer: result.player1,
    losingGoals: result.player1goals
  };
};

type HeadToHeadStats = {
  player1Wins: number;
  player2Wins: number;
  player1Goals: number;
  player2Goals: number;
};

export const getHeadToHeadStats = (
  results: readonly Result[],
  player1name: string,
  player2name: string
): HeadToHeadStats => {
  const reduceFunc = (
    stats: HeadToHeadStats,
    currentResult: WinningLosingResult
  ) => {
    if (currentResult.winningPlayer.name === player1name) {
      return {
        ...stats,
        player1Goals: stats.player1Goals + currentResult.winningGoals,
        player2Goals: stats.player2Goals + currentResult.losingGoals
      };
    }
    return {
      ...stats,
      player1Goals: stats.player1Goals + currentResult.losingGoals,
      player2Goals: stats.player2Goals + currentResult.winningGoals
    };
  };

  const winningLosingResults: readonly WinningLosingResult[] = results.map(
    toWinningLosingResult
  );

  const player1Wins = winningLosingResults.filter(
    r => r.winningPlayer.name === player1name
  ).length;

  const player2Wins = winningLosingResults.filter(
    r => r.winningPlayer.name === player2name
  ).length;

  const headToHeadStats: HeadToHeadStats = winningLosingResults.reduce(
    reduceFunc,
    {
      player1Wins,
      player2Wins,
      player1Goals: 0,
      player2Goals: 0
    }
  );

  return headToHeadStats;
};
