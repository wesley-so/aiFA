import axios from "axios";
import config from "../../config";

export const daily = async (symbol: string) => {
  const response = await axios.post(
    `${config.apiUrl}/stock/daily`,
    { symbol },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export const stockGraph = async (symbol: string) => {
  const response = await axios.post<string>(
    `${config.apiUrl}/stock/graph`,
    { symbol },
    {}
  );
  return response.data;
};
