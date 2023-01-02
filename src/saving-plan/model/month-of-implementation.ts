export type MonthOfImplementation = {
  month: number;
  year: number;
  x: {
    plannedToSpent: number;
    spent: number;
  }[];
};
