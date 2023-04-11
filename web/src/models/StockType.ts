export const allStockType = [
  "AAPL",
  "AMZN",
  "BABA",
  "CSCO",
  "GOOG",
  "META",
  "MSFT",
  "NVDA",
  "ORCL",
  "TSLA",
] as const;

type allStockTypeTuple = typeof allStockType;

export type StockType = allStockTypeTuple[number];

export default StockType;
