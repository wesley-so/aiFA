import axios from "axios";
import config from "../../config";
import Prediction from "../../models/Prediction";

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

export const create_portfolio = async (
  token: string,
  portfolio: Array<object>
) => {
  const response = await axios.post(
    `${config.apiUrl}/stock/portfolio/create`,
    { portfolio },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};

export const latest_close = async (token: string, symbol: string) => {
  const response = await axios.post<{ close: number }>(
    `${config.apiUrl}/stock/latest/close`,
    { symbol },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const all_portfolio = async (token: string) => {
  const response = await axios.post(
    `${config.apiUrl}/stock/portfolio/all`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const prediction = async (token: string, symbol: string) => {
  const response = await axios.post<Prediction>(
    `${config.apiUrl}/stock/predict`,
    { stock: symbol },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
