import { createContext } from "react";
import LoginStatus from "../models/LoginStatus";
import User from "../models/User";

interface UserContextProps {
  token?: string;
  user?: User;
  loginStatus: LoginStatus;
  fetchLogin: (username: string, password: string) => void;
  fetchLogout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export default UserContext;
