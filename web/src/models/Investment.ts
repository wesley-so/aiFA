import { StockType } from "./StockType";

interface Investment {
  symbol: StockType;
  weight: number;
  price: number;
}

export default Investment;
