export const formatDate = (date: Date) => date.toISOString().substring(0, 10);

export const validNumberOfGoals = (goalsString: string) => {
  const goalsNumber = Number(goalsString);
  return isNaN(goalsNumber) ? 0 : Math.max(Math.floor(goalsNumber), 0);
};
