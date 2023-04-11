import StockType from "./StockType";

interface Prediction {
  symbol: StockType;
  predict_1: number;
  predict_3: number;
  predict_5: number;
}

export default Prediction;
