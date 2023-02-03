import { useContext } from "react";
import UserContext from "../context/UserContext";

const useUser = () => {
  const props = useContext(UserContext);

  if (!props) {
    throw new Error("`useUser` hooks cannot use outside `UserContext`.");
  }

  return props;
};

export default useUser;
