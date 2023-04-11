import { useCallback, useState } from "react";
import { prediction } from "../services/aifaAPI/stock";
import { AxiosError } from "axios";

const usePredict = () => {
  const [predict, setPredict] = useState<Array<object>>();
  const [isPredictLoading, setIsPredictLoading] = useState(false);
  const [predictError, setPredictError] = useState(undefined);
  const [predictSuccess, setPredictSuccess] = useState(false);
  const fetchPredict = useCallback(async (token: string, symbol: string) => {
    setPredict(undefined);
    setIsPredictLoading(true);
    setPredictError(undefined);
    setPredictSuccess(false);
    try {
      const predict_list = await prediction(token, symbol);
      setPredict(predict_list);
      setPredictSuccess(true);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data.error
          ? error.response.data.error
          : "Unknown error occured.";
      setPredictError(errorMsg);
    }
    setIsPredictLoading(false);
  }, []);
  return {
    predict,
    isPredictLoading,
    fetchPredict,
    predictError,
    predictSuccess,
  };
};

export default usePredict;
