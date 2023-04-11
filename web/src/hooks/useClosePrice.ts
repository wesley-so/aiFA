import { useCallback, useState } from "react";
import { latest_close } from "../services/aifaAPI/stock";
import { AxiosError } from "axios";

const useClosePrice = () => {
  const [close, setClose] = useState<{ close: number }>();
  const [isCloseLoading, setIsCloseLoading] = useState(false);
  const [closeError, setCloseError] = useState(undefined);
  const [closeSuccess, setCloseSuccess] = useState(false);
  const fetchClose = useCallback(async (token: string, symbol: string) => {
    setClose(undefined);
    setIsCloseLoading(true);
    setCloseError(undefined);
    setCloseSuccess(false);
    try {
      const close_price = await latest_close(token, symbol);
      setClose(close_price);
      setCloseSuccess(true);
    } catch (error) {
      const errorMsg =
        error instanceof AxiosError && error.response?.data.error
          ? error.response.data.error
          : "Unknown error occured.";
      return setCloseError(errorMsg);
    }
    setIsCloseLoading(false);
  }, []);
  return { close, isCloseLoading, fetchClose, closeError, closeSuccess };
};

export default useClosePrice;
