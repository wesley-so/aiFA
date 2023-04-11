import { useCallback, useState } from "react";
import { all_portfolio } from "../services/aifaAPI/stock";
import { AxiosError } from "axios";
import Investment from "../models/Investment";

const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Array<Investment>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(false);
  const fetchPortfolio = useCallback(async (token: string) => {
    setPortfolio([]);
    setIsLoading(true);
    setError(undefined);
    setSuccess(false);
    try {
      const investments = await all_portfolio(token);
      console.log(investments[0].portfolio);
      const portfolio_list = investments[0].portfolio;
      setPortfolio(portfolio_list);
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
  return { portfolio, isLoading, fetchPortfolio, error, success };
};

export default usePortfolio;
