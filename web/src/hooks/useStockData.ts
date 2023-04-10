import { useCallback, useState } from "react";
import Stock from "../models/Stock";
import { daily } from "../services/aifaAPI/stock";
import { AxiosError } from "axios";

const useStockData = () => {
  const [stockInfo, setStockInfo] = useState<Stock>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const fetch = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setError(undefined);
    setSuccess(false);
    try {
      const stockData = await daily(symbol);
      setStockInfo(stockData);
      setSuccess(true);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data.error
          ? error.response.data.error
          : "Unknown error occured.";
      setError(errorMsg);
    }
    setIsLoading(false);
  }, []);
  return { stockInfo, isLoading, fetch, error, success };
};

export default useStockData;
