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

export const graphData = async (symbol: string) => {
  const response = await axios.post<HTMLElement>(
    `${config.apiUrl}/stock/graph`,
    { symbol },
    { headers: { "Content-Type": "text/html" } }
  );
  return response;
};
