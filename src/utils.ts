import { Result, Player } from "./queries";
import {
  format,
  getHours,
  setHours,
  getMinutes,
  setMinutes,
  setSeconds,
  getSeconds
} from "date-fns";

export const formatDate = (date: Date) => format(date, "YYYY-MM-DD");

export const withCurrentTime = (date: Date, now: Date) => {
  const dateWithCurrentHours = setHours(date, getHours(now));
  const dateWithCurrentMinutes = setMinutes(
    dateWithCurrentHours,
    getMinutes(now)
  );
  return setSeconds(dateWithCurrentMinutes, getSeconds(now));
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

type PlayerStats = {
  numberOfWins: number;
  numberOfLosses: number;
  goalsScored: number;
  goalsConceded: number;
};

export const getPlayerStats = (
  results: readonly Result[],
  playername: string
): PlayerStats => {
  const addGoals = (stats: PlayerStats, currentResult: WinningLosingResult) => {
    if (currentResult.winningPlayer.name === playername) {
      return {
        ...stats,
        goalsScored: stats.goalsScored + currentResult.winningGoals,
        goalsConceded: stats.goalsConceded + currentResult.losingGoals
      };
    }
    return {
      ...stats,
      goalsScored: stats.goalsScored + currentResult.losingGoals,
      goalsConceded: stats.goalsConceded + currentResult.winningGoals
    };
  };

  const winningLosingResults: readonly WinningLosingResult[] = results.map(
    toWinningLosingResult
  );

  const numberOfWins = winningLosingResults.filter(
    r => r.winningPlayer.name === playername
  ).length;

  const numberOfLosses = winningLosingResults.filter(
    r => r.winningPlayer.name !== playername
  ).length;

  const playerStats: PlayerStats = winningLosingResults.reduce(addGoals, {
    numberOfWins,
    numberOfLosses,
    goalsScored: 0,
    goalsConceded: 0
  });

  return playerStats;
};
