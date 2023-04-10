import { useCallback, useState } from "react";
import { stockGraph } from "../services/aifaAPI/stock";
import { AxiosError } from "axios";

const useStockGraph = () => {
  const [graph, setGraph] = useState<string>();
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState<string>();
  const [graphSuccess, setGraphSuccess] = useState(false);
  const fetchGraph = useCallback(async (token: string, symbol: string) => {
    setGraph(undefined);
    setIsGraphLoading(true);
    setGraphError(undefined);
    setGraphSuccess(false);
    try {
      const image = await stockGraph(token, symbol);
      setGraph(image);
      setGraphSuccess(true);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data.error
          ? error.response.data.error
          : "Unknown error occured.";
      setGraphError(errorMsg);
    }
    setIsGraphLoading(false);
  }, []);
  return { graph, isGraphLoading, fetchGraph, graphError, graphSuccess };
};

export default useStockGraph;
