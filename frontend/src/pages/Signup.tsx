/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axiosClient from "../axios.tsx";
import { useStateContext } from "@/contexts/ContextProvider.tsx";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function Signup() {
  const { setCurrentUser, setUserToken } = useStateContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState({ __html: "" });
  const [gData, setGData] = useState<GoogleData>({  });

  interface GoogleData {
    name: string;
    email: string;
    azp: string;
  }

  useEffect(() => {
    //This block will be executed whenever gData is updated
    if (gData.name && gData.email) {
      axiosClient
        .post("/signup", {
          username: gData.name,
          email: gData.email,
          access_token: gData.azp

        })
        .then(({ data }) => {
          setCurrentUser(data.user);
          setUserToken(data.token);
        })
        .catch((error) => {
          if (error.response) {
            const finalErrors = (
              Object.values(error.response.data.errors) as ErrorArray
            ).reduce<string[]>((accum, next) => [...accum, ...next], []);
            setError({ __html: finalErrors.join("<br />") });
          }
          console.log(error);
        });
      console.log(gData);
    }
  }, [gData, setCurrentUser, setError, setUserToken]); // Only run the effect if gData changes

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .post("/signup", {
        username: username,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      })
      .then(({ data }) => {
        setCurrentUser(data.user);
        setUserToken(data.token);
      })
      .catch((error) => {
        if (error.response) {
          const finalErrors = (
            Object.values(error.response.data.errors) as ErrorArray
          ).reduce<string[]>((accum, next) => [...accum, ...next], []);
          setError({ __html: finalErrors.join("<br />") });
        }
        console.log(error);
      });
  };

  return (
    <>
      <h1>Signup</h1>
      <GoogleLogin
        onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            setGData(jwtDecode(credentialResponse.credential));
          }
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        auto_select
      />;

      {error.__html && (
        <div
          className="bg-red-500 rounded py-2 px-3 text-white"
          dangerouslySetInnerHTML={error}
        ></div>
      )}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          required
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
    </>
  );
}
