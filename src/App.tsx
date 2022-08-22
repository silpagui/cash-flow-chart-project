import React, { useState, useEffect, useMemo } from "react";
import "./transactions.utils";
import "./App.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  balanceMapToSortedArr,
  makeBalanceMap,
  sortTransactionsByDate,
} from "./transactions.utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

export const options = {
  responsive: true,
};
const APIkey =
  "34044a757e0385e54e8c5141bad3bb3abb463727afac3cccb8e31d313db9a370";

const transactionsURL =
  "https://uh4goxppjc7stkg24d6fdma4t40wxtly.lambda-url.eu-central-1.on.aws/transactions";

const balanceURL =
  "https://uh4goxppjc7stkg24d6fdma4t40wxtly.lambda-url.eu-central-1.on.aws/balances";

function buildURLProxy(url: string) {
  return `https://cors-anywhere.herokuapp.com/${url}`;
}

type BalanceState = {
  amount: null | number;
  currency: string;
};

function App() {
  const [balance, setBalance] = useState<BalanceState>({
    amount: null,
    currency: "",
  });
  const [data, setData] = useState({ transactions: [] });

  useEffect(() => {
    axios
      .get(buildURLProxy(balanceURL), {
        headers: {
          Authorization: APIkey,
        },
      })
      .then((response) => {
        setBalance(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [setBalance]);

  useEffect(() => {
    axios
      .get(buildURLProxy(transactionsURL), {
        headers: { Authorization: APIkey },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [setData]);

  const orderedBalance = useMemo(() => {
    if (data.transactions.length && balance.amount !== null) {
      const orderedTransactions = sortTransactionsByDate(data.transactions);
      const balanceMap = makeBalanceMap(orderedTransactions, balance.amount);
      const balanceSortedArr = balanceMapToSortedArr(balanceMap);
      return balanceSortedArr;
    } else {
      return [];
    }
  }, [data.transactions, balance.amount]);

  const labels = orderedBalance.map((item) => item.timestamp);
  const dataChart = {
    labels: labels,
    datasets: [
      {
        fill: true,
        data: orderedBalance.map((item) => item.runningBalance),
        borderColor: "rgb(129, 200, 149)",
        backgroundColor: "rgba(129, 200, 149, 0.2)",
      },
    ],
  };

  return (
    <div className="App">
      <header>
        <h1 className="title">Cash Flow Chart Project</h1>
      </header>
      <div className="content">
        <div className="balance">
          <p className="balance-amount">{balance.amount}</p>
          <p className="balance-currency">{balance.currency}</p>
        </div>
        <div>
          {orderedBalance.length > 0 && (
            <Line options={options} data={dataChart} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
