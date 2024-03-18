import {
  createContext,
  useContext,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  queryClient.setQueryData(["curretUser"], { username: "", email: "" });
  queryClient.setQueryData(["userToken"], null);

  const crsf = () => axios.get("/sanctum/crsf-cookie");

  const login = async (username: string, password: string) => {
    try {
      await crsf();
      const response = await axios.post("/login", {
        username,
        password,
      });
      queryClient.setQueryData(["curretUser"], response.data.user);
      queryClient.setQueryData(["userToken"], response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      await crsf();
      const response = await axios.post("/register", {
        username,
        email,
        password,
      });
      queryClient.setQueryData(["curretUser"], response.data.user);
      queryClient.setQueryData(["userToken"], response.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    queryClient.setQueryData(["curretUser"], { username: "", email: "" });
    queryClient.setQueryData(["userToken"], null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );

  //   const [user, setUser] = useState({
  //     username: "",
  //     email: "",
  //   });

  //   const [token, setToken] = useState<string | null>(null);

  //   const login = async (username: string, password: string) => {
  //     try {
  //       const response = await axios.post("/auth/login", {
  //         username,
  //         password,
  //       });
  //       setToken(response.data.token);
  //       setUser(response.data.user);
  //       localStorage.setItem("TOKEN", response.data.token);
  //       queryClient.setQueryData(["user"], response.data.user);
  //       queryClient.setQueryData(["token"], response.data.token);
  //       navigate("/");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   const logout = () => {
  //     setToken(null);
  //     setUser({ username: "", email: "" });
  //     localStorage.removeItem("TOKEN");
  //     queryClient.setQueryData(["user"], { username: "", email: "" });
  //     queryClient.setQueryData(["token"], null);
  //     navigate("/login");
  //   };

  //   return (
  //     <AuthContext.Provider value={{ user, token, login, logout }}>
  //       {children}
  //     </AuthContext.Provider>
  //   );
};
