import { useEffect } from "react";
import axiosClient from "@/services/axios";

export default function Test() {
  // const axiosClient = axios.create({
  //   baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  //   withCredentials: true,
  // });

  useEffect(() => {
    httpCall();
  }, []);

  async function httpCall() {
    // const crsf = await axiosClient.get("/sanctum/csrf-cookie");
    // console.log("crsf ", crsf);
    // const login = await axiosClient.post("/login", {
    //   email: "mike@gmail.com",
    //   password: "M1k@123456",
    // });
    // console.log("login ", login);
    // const signup = await axiosClient.post("/signup", {
    //   username: "mike13",
    //   email: "mike13@gmail.com",
    //   password: "M1k@123456",
    //   password_confirmation: "M1k@123456",
    // });
    // console.log("signup ", signup);
    // const logout = await http.post("/api/logout2");
    // console.log("login ", logout);
    const me = await axiosClient.get("/videos");
    console.log("me: ", me);
  }

  return (
    <>
      <div>Login</div>
      <div>Register</div>
    </>
  );
}
