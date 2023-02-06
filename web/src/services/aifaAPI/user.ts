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

// export const register = () => {
//   // do register
// };

export const getUser = async (token: string): Promise<User> => {
  const { data } = await axios.get<User>(`${config.apiUrl}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
