export type Transaction = {
  amount: number;
  currency: string;
  date: string;
  status: string;
};

export type BalanceMap = {
  [key: string]: number;
};

export type BalanceItem = {
  timestamp: string;
  runningBalance: number;
};
