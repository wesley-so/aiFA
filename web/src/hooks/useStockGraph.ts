import { useCallback, useState } from "react";
import { stockGraph } from "../services/aifaAPI/stock";
import { AxiosError } from "axios";

const useStockGraph = (symbol: string) => {
  const [graph, setGraph] = useState<string>();
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState<string>();
  const [graphSuccess, setGraphSuccess] = useState(false);
  const fetchGraph = useCallback(async () => {
    setGraph(undefined);
    setIsGraphLoading(true);
    setGraphError(undefined);
    setGraphSuccess(false);
    try {
      const image = await stockGraph(symbol);
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
  }, [symbol]);
  return { graph, isGraphLoading, fetchGraph, graphError, graphSuccess };
};

export default useStockGraph;
