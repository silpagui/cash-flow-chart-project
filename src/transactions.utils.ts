import { BalanceItem, BalanceMap, Transaction } from "./transactions.models";

export function sortByDateString(a: string, b: string): number {
  const dateA = new Date(a);
  const dateB = new Date(b);

  if (dateA > dateB) {
    return -1;
  } else if (dateA.getTime() === dateB.getTime()) {
    return 0;
  } else {
    return 1;
  }
}

export function sortTransactionsByDate(transactions: Transaction[]) {
  return transactions.sort((a, b) => {
    return sortByDateString(a.date, b.date);
  });
}

export function makeBalanceMap(
  orderedTransactions: Transaction[],
  balance: number
): BalanceMap {
  const balanceMap: BalanceMap = {};

  orderedTransactions.forEach((transaction) => {
    const dateKey = transaction.date.split("T")[0];
    const computedAmount = -transaction.amount;
    balance = balance + computedAmount;
    balanceMap[dateKey] = balance;
  });

  return balanceMap;
}

export function balanceMapToSortedArr(balanceMap: BalanceMap): BalanceItem[] {
  const orderedBalance = Object.keys(balanceMap)
    .map((dateKey) => {
      return {
        timestamp: dateKey,
        runningBalance: balanceMap[dateKey],
      };
    })
    .sort((a, b) => {
      return sortByDateString(a.timestamp, b.timestamp);
    })
    .map((transaction) => {
      const date = new Date(transaction.timestamp);
      const transactionDate = `${date.getUTCDate()}-${date.getUTCMonth()}-${date.getUTCFullYear()}`;
      transaction.timestamp = transactionDate;
      return transaction;
    });

  return orderedBalance;
}
