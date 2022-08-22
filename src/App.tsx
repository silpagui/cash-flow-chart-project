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

import { Transaction } from "./transactions.models";
import { APIkey, balanceURL, buildURLProxy, transactionsURL } from "./api.core";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

type BalanceState = {
  amount: null | number;
  currency: string;
};

type ResponseTransactionsData = {
  transactions: Transaction[];
};
function App() {
  const [balance, setBalance] = useState<BalanceState>({
    amount: null,
    currency: "",
  });

  const [data, setData] = useState<ResponseTransactionsData>({
    transactions: [],
  });

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

  const dataChart = {
    labels: orderedBalance.map((item) => item.timestamp),
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
            <Line
              options={{
                responsive: true,
              }}
              data={dataChart}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
