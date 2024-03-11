/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { useStateContext } from "@/contexts/ContextProvider.tsx";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { google } from 'googleapis';

const CLIENT_ID = "665242793026-cmskapaiveadved5rqgfab5f8rk4p52d.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const SCOPE = "https://www.googleapis.com/auth/drive.metadata.readonly";

export default function SignupAPI() {
  const { setCurrentUser, setUserToken } = useStateContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState({ __html: "" });
  const [gData, setGData] = useState<GoogleData>({  });
  const [accessToken, setAccessToken] = useState<string>();
  const [tokenClient, setTokenClient] = useState({});

  const oauth2Client = new google.auth.OAuth2(
    "665242793026-cmskapaiveadved5rqgfab5f8rk4p52d.apps.googleusercontent.com",
    "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",
    "http://localhost:3000",
  );

  const scopes = [
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });

  res.writeHead(301, { "Location": authorizationUrl });

  interface GoogleData {
    name: string;
    email: string;
    azp: string;
  }

  function handleCallbackResponse(response :any){
    console.log(response);
    console.log(response.credential);
  };

  // function createDriveFile(authorizationCode: string){
    // const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    
    // axiosClient.post(tokenEndpoint, {
    //   code: authorizationCode,
    //   client_id: CLIENT_ID,
    //   client_secret: CLIENT_SECRET,
    //   redirect_uri: "http://localhost:3000/signup",
    //   grant_type: 'authorization_code',
    // })
    //   .then(response => {
    //     const refreshToken = response.data.refresh_token;
    //     console.log('Refresh Token:', refreshToken);
    //   })
    //   .catch(error => {
    //     console.error('Error obtaining tokens:', error.response.data);
    //   });
    // tokenClient.requestAccessToken();

  //   const requestBody = {
  //     client_id: '<YOUR_CLIENT_ID>',
  //     client_secret: '<YOUR_CLIENT_SECRET>',
  //     refresh_token: '<REFRESH_TOKEN_FOR_THE_USER>',
  //     grant_type: 'refresh_token'
  //   };
    
  //   fetch('https://www.googleapis.com/oauth2/v4/token', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(requestBody)
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Here's the refreshed access token and related information
  //     console.log(data.access_token); // Your refreshed access token
  //     console.log(data.expires_in); // Time until expiration in seconds
  //     console.log(data.scope); // Set of scopes you've granted
  //     console.log(data.token_type); // Token type (Bearer)
  //   })
  //   .catch(error => {
  //     // Handle errors if the request fails
  //     console.error('Error:', error);
  //   });
  // }


  useEffect(() => {
    /* global google */
    const google = window.google;
    // google.accounts.id.initialize({
    //   client_id: CLIENT_ID,
    //   callback: handleCallbackResponse,
    // })

    // window.onload = function () {
    //   google.accounts.id.initialize({
    //     client_id: "YOUR_GOOGLE_CLIENT_ID",
    //     callback: handleCredentialResponse,
    //   });
    //   google.accounts.id.renderButton(
    //     document.getElementById("buttonDiv"),
    //     { theme: "outline", size: "large" }  // customization attributes
    //   );
    //   google.accounts.id.prompt(); // also display the One Tap dialog
    // }

    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      scope: SCOPE,
      response_type: "code",
      access_type: "offline",
      redirect_uri: "http://localhost:3000",
      callback: async  (response :any) => {
        console.log(response);
      }
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: "outline", size: "large"}
    );



    // setTokenClient(
    //   google.accounts.oauth2.initTokenClient({
    //     client_id: CLIENT_ID,
    //     client_secret: CLIENT_SECRET,
    //     scope: SCOPE,
    //     prompt: "consent",
    //     response_type: "code",
    //     access_type: "offline",
    //     approval_prompt: "force",
    //     callback: async  (tokenResponse :any) => {
    //       console.log(tokenResponse);
    //       console.log(tokenResponse.refresh_token);

    //       // const response = await axios.post(
    //       //   'https://oauth2.googleapis.com/token',
    //       //   {
    //       //     refresh_token: refreshToken,
    //       //     client_id: 'YOUR_CLIENT_ID',
    //       //     client_secret: 'YOUR_CLIENT_SECRET',
    //       //     grant_type: 'refresh_token',
    //       //   }
    //       // );

    //       // if(tokenResponse && tokenResponse.access_token) {
    //       //   fetch("https://www.googleapis.com/drive/v3/files",{
    //       //     method: "POST",

    //       //   })
    //       // }
    //     },
    //   })
    // );
    
    //tokenClient.requestAccessToken();


    //This block will be executed whenever gData is updated
    // if (gData.name && gData.email) {
    //   axiosClient
    //     .post("/signup", {
    //       username: gData.name,
    //       email: gData.email,
    //     })
    //     .then(({ data }) => {
    //       setCurrentUser(data.user);
    //       setUserToken(data.token);
    //     })
    //     .catch((error) => {
    //       if (error.response) {
    //         const finalErrors = (
    //           Object.values(error.response.data.errors) as ErrorArray
    //         ).reduce<string[]>((accum, next) => [...accum, ...next], []);
    //         setError({ __html: finalErrors.join("<br />") });
    //       }
    //       console.log(error);
    //     });
    //   console.log(gData);
    // }
  }, [accessToken, gData, setCurrentUser, setError, setUserToken]); // Only run the effect if gData changes

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

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
  }});

  return (
    <>
      <h1>Signup</h1>

      {/* <button onClick={createDriveFile}>get access token</button> */}

      <div id="signInDiv">Click here fool</div>

      {/* <GoogleLogin
        onSuccess={credentialResponse => {
          if (credentialResponse.credential) {
            setGData(jwtDecode(credentialResponse.credential));
            setAccessToken(credentialResponse.credential);
            // axiosClient
            // .post("/signup", {
            //   username: gData.name,
            //   email: gData.email,
            //   access_token: gData.azp
            // })
            // .then(({ data }) => {
            //   setCurrentUser(data.user);
            //   setUserToken(data.token);
            // })
            // .catch((error) => {
            //   if (error.response) {
            //     const finalErrors = (
            //       Object.values(error.response.data.errors) as ErrorArray
            //     ).reduce<string[]>((accum, next) => [...accum, ...next], []);
            //     setError({ __html: finalErrors.join("<br />") });
            //   }
            //   console.log(error);
            // });
          }
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        // auto_select
      />; */}

      <button onClick={() => login()}>Sign in with Google 🚀</button>;


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
