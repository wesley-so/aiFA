import { useCallback, useState } from "react";
import User from "../models/User";
import { getUser } from "../services/aifaAPI/user";
import { AxiosError } from "axios";

const useUserProfile = (token: string) => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const fetch = useCallback(async () => {
    setIsLoading(true);
    setSuccess(false);
    setUser(undefined);
    setError(undefined);
    if (token) {
      try {
        const userData = await getUser(token);
        setUser(userData);
        setSuccess(true);
      } catch (error) {
        const errorMsg =
          error instanceof AxiosError && error.response?.data?.error
            ? error.response.data.error
            : "Unknown error occured.";
        setError(errorMsg);
      }
    } else {
      setError("User unauthorized.");
    }
    setIsLoading(false);
  }, [token]);
  return { user, isLoading, fetch, error, success };
};

export default useUserProfile;
