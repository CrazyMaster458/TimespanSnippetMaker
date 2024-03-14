/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router.tsx";
import { ContextProvider } from "./contexts/ContextProvider.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorHandler from "./utils/error.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <ErrorHandler>
          <RouterProvider router={router}></RouterProvider>
          <ReactQueryDevtools />
        </ErrorHandler>
      </ContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
