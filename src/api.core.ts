export const APIkey =
  "34044a757e0385e54e8c5141bad3bb3abb463727afac3cccb8e31d313db9a370";

export const transactionsURL =
  "https://uh4goxppjc7stkg24d6fdma4t40wxtly.lambda-url.eu-central-1.on.aws/transactions";

export const balanceURL =
  "https://uh4goxppjc7stkg24d6fdma4t40wxtly.lambda-url.eu-central-1.on.aws/balances";

export function buildURLProxy(url: string) {
  return `https://cors-anywhere.herokuapp.com/${url}`;
}
