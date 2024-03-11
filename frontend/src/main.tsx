/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.tsx";
import { ContextProvider } from "./contexts/ContextProvider.tsx";
// import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId="665242793026-cmskapaiveadved5rqgfab5f8rk4p52d.apps.googleusercontent.com"> */}
      <ContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </ContextProvider>
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);
