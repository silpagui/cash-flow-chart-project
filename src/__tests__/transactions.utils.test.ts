import {
  sortByDateString,
  sortTransactionsByDate,
  makeBalanceMap,
  balanceMapToSortedArr,
} from "../transactions.utils";

test("When I call the function sorByDateString with the dates 2022-02-07T09:57:27.235Z and 2022-02-08T09:57:27.235Z it should return 1 because the first date is older than the second date", () => {
  expect(
    sortByDateString("2022-02-07T09:57:27.235Z", "2022-02-08T09:57:27.235Z")
  ).toBe(1);
});

test("When I call the function sorByDateString with the dates 2022-02-07T09:57:27.235Z and 2022-02-05T09:57:27.235Z it should return -1 because the first date is newer than the second date", () => {
  expect(
    sortByDateString("2022-02-07T09:57:27.235Z", "2022-02-05T09:57:27.235Z")
  ).toBe(-1);
});

test("When I call the function sorByDateString with the dates 2022-02-07T09:57:27.235Z and 2022-02-07T09:57:27.235Z it should return 0 because the first date is equal to the second date", () => {
  expect(
    sortByDateString("2022-02-07T09:57:27.235Z", "2022-02-07T09:57:27.235Z")
  ).toBe(0);
});

test("When I call sortTransactionsByDate with valid transactions, it should return an ordered array by transactions dates", () => {
  const transactionsMock = [
    {
      amount: -765,
      currency: "EUR",
      date: "2022-02-07T09:57:27.235Z",
      status: "BOOKED",
    },
    {
      amount: -911,
      currency: "EUR",
      date: "2022-01-03T22:00:09.002Z",
      status: "PROCESSED",
    },
    {
      amount: -397,
      currency: "EUR",
      date: "2022-03-06T11:21:15.655Z",
      status: "PROCESSED",
    },
  ];

  const orderedTransactionsMock = [
    {
      amount: -397,
      currency: "EUR",
      date: "2022-03-06T11:21:15.655Z",
      status: "PROCESSED",
    },
    {
      amount: -765,
      currency: "EUR",
      date: "2022-02-07T09:57:27.235Z",
      status: "BOOKED",
    },
    {
      amount: -911,
      currency: "EUR",
      date: "2022-01-03T22:00:09.002Z",
      status: "PROCESSED",
    },
  ];

  expect(sortTransactionsByDate(transactionsMock)).toStrictEqual(
    orderedTransactionsMock
  );
});

test("When I call the function makeBalanceMap I should receive two arguments, an array of ordered transactions and a balance, and it should return an object with dates as keys related to a balance as value", () => {
  const orderedTransactionsMock = [
    {
      amount: -397,
      currency: "EUR",
      date: "2022-03-06T11:21:15.655Z",
      status: "PROCESSED",
    },
    {
      amount: -765,
      currency: "EUR",
      date: "2022-02-07T09:57:27.235Z",
      status: "BOOKED",
    },
    {
      amount: -911,
      currency: "EUR",
      date: "2022-01-03T22:00:09.002Z",
      status: "PROCESSED",
    },
  ];

  const balanceMapMock = {
    "2022-03-06": 497,
    "2022-02-07": 1262,
    "2022-01-03": 2173,
  };

  const result = makeBalanceMap(orderedTransactionsMock, 100);
  expect(result).toStrictEqual(balanceMapMock);
});

test("When I call the function sortBalanceMap I should receive an object of balances by argument, it should return an array of objects ordered by keys of dates", () => {
  const balanceMapMock = {
    "2022-01-03": 300,
    "2022-03-06": 200,
    "2022-02-07": 1,
  };

  const orderedBalanceList = [
    {
      timestamp: "6-2-2022",
      runningBalance: 200,
    },
    {
      timestamp: "7-1-2022",
      runningBalance: 1,
    },
    {
      timestamp: "3-0-2022",
      runningBalance: 300,
    },
  ];

  const result = balanceMapToSortedArr(balanceMapMock);

  expect(result).toStrictEqual(orderedBalanceList);
});
