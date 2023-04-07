import axios from "axios";
import config from "../../config";
import User from "../../models/User";

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const response = await axios.post<{ token: string }>(
    `${config.apiUrl}/user/login`,
    { username, password },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data.token;
};

export const logout = async (token: string) => {
  await axios.post(
    `${config.apiUrl}/user/logout`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const register = async (
  username: string,
  email: string,
  password: string,
  password_confirm: string
) => {
  const response = await axios.post(
    `${config.apiUrl}/user/register`,
    { username, email, password, password_confirm },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data.user_id;
};

export const getUser = async (token: string): Promise<User> => {
  const { data } = await axios.get<User>(`${config.apiUrl}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const changePassword = async (token: string, new_password: string) => {
  const response = await axios.put(
    `${config.apiUrl}/user/me`,
    { new_password },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};
