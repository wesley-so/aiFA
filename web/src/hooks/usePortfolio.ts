import { useCallback, useState } from "react";
import { all_portfolio } from "../services/aifaAPI/stock";
import { AxiosError } from "axios";
import Portfolio from "../models/Portfolio";

const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState<Array<Portfolio>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(false);
  const fetchPortfolio = useCallback(async (token: string) => {
    setPortfolios([]);
    setIsLoading(true);
    setError(undefined);
    setSuccess(false);
    try {
      const portfoliosData = await all_portfolio(token);
      setPortfolios(portfoliosData);
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
  return { portfolios, isLoading, fetchPortfolio, error, success };
};

export default usePortfolio;
