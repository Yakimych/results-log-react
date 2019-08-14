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
  date: Date;
  extratime: boolean;
};

const toWinningLosingResult = (result: Result): WinningLosingResult => {
  const player1IsWinner = result.player1goals > result.player2goals;
  if (player1IsWinner) {
    return {
      ...result,
      date: new Date(result.date),
      winningPlayer: result.player1,
      winningGoals: result.player1goals,
      losingPlayer: result.player2,
      losingGoals: result.player2goals
    };
  }
  return {
    ...result,
    date: new Date(result.date),
    winningPlayer: result.player2,
    winningGoals: result.player2goals,
    losingPlayer: result.player1,
    losingGoals: result.player1goals
  };
};

export type Streak = {
  // TODO: Discriminated union?
  numberOfMatches: number;
  startedAt: Date;
  endedAt: Date | null;
  endedBy: Player | null;
};

type Streaks = {
  longestStreak: Streak | null;
  currentStreak: Streak | null;
};

type PlayerStats = {
  numberOfWins: number;
  numberOfLosses: number;
  goalsScored: number;
  goalsConceded: number;
  streaks: Streaks;
};

const byDateOldestFirst = (
  result1: WinningLosingResult,
  result2: WinningLosingResult
) => {
  if (result1.date > result2.date) {
    return 1;
  }
  if (result1.date < result2.date) {
    return -1;
  }
  return 0;
};

const getWinningStreaks = (
  playerName: string,
  unsortedResults: readonly WinningLosingResult[]
): Streaks => {
  const sortedResults = unsortedResults.slice().sort(byDateOldestFirst);

  if (
    sortedResults.filter(r => r.winningPlayer.name === playerName).length === 0
  ) {
    return { currentStreak: null, longestStreak: null };
  }

  let longestStreakStartDate: Date = sortedResults[0].date;
  let longestStreakEndDate: Date = sortedResults[0].date;
  let currentStreakStartDate: Date = sortedResults[0].date;
  let currentStreakEndDate: Date | null = null;
  let longestStreakNumberOfMatches: number = 0;
  let currentStreakNumberOfMatches: number = 0;
  let longestStreakEndedBy: Player | null = null;

  for (const result of sortedResults) {
    if (result.winningPlayer.name === playerName) {
      if (currentStreakNumberOfMatches === 0) {
        // New streak has started
        currentStreakStartDate = result.date;
      }
      currentStreakNumberOfMatches++;
    }

    if (result.losingPlayer.name === playerName) {
      // Streak ended
      if (currentStreakNumberOfMatches > longestStreakNumberOfMatches) {
        // Update the longest streak
        longestStreakNumberOfMatches = currentStreakNumberOfMatches;
        longestStreakStartDate = currentStreakStartDate;
        longestStreakEndDate = result.date;
        longestStreakEndedBy = result.winningPlayer;
      }
      // Reset current streak
      currentStreakNumberOfMatches = 0;
      currentStreakEndDate = null;
    }
  }

  return {
    longestStreak: {
      numberOfMatches: longestStreakNumberOfMatches,
      startedAt: longestStreakStartDate,
      endedAt: longestStreakEndDate,
      endedBy: longestStreakEndedBy
    },
    currentStreak: {
      numberOfMatches: currentStreakNumberOfMatches,
      startedAt: currentStreakStartDate,
      endedAt: currentStreakEndDate,
      endedBy: null
    }
  };
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

  const streaks = getWinningStreaks(playername, winningLosingResults);

  const playerStats: PlayerStats = winningLosingResults.reduce(addGoals, {
    numberOfWins,
    numberOfLosses,
    goalsScored: 0,
    goalsConceded: 0,
    streaks
  });

  return playerStats;
};
