/* eslint-disable react-refresh/only-export-components */
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface User {
  name: string;
  email: string;
}

interface ContextType {
  currentUser: User;
  userToken: string | null;
  setcurrentUser: Dispatch<SetStateAction<User>>;
  setUserToken: Dispatch<SetStateAction<string | null>>;
}

const defaultContext: ContextType = {
  currentUser: {
    name: "",
    email: "",
  },
  userToken: null,
  setcurrentUser: () => {},
  setUserToken: () => {},
};

const StateContext = createContext(defaultContext);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setcurrentUser] = useState<User>({ name: "", email: "" });
  const [userToken, setUserToken] = useState<string | null>(null);

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setcurrentUser,
        userToken,
        setUserToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
