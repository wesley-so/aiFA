import axios from "axios";
import config from "../../config";

export const daily = async (token: string, symbol: string) => {
  const response = await axios.post(
    `${config.apiUrl}/stock/daily`,
    { symbol },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const stockGraph = async (token: string, symbol: string) => {
  const response = await axios.post<string>(
    `${config.apiUrl}/stock/graph`,
    { symbol },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
