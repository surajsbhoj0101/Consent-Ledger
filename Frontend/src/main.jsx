import "./index.css";

import ReactDOM from "react-dom/client";
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./context/web3AuthContext";
import { BrowserRouter } from "react-router-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Snowfall from "react-snowfall";

import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import Navbar from "./components/Navbar";
import Company_Details_Input from "./pages/Company_Pages/RegisterCompany";
import RegisterCompany from "./pages/Company_Pages/RegisterCompany";
import RegisterUser from "./pages/User_Pages/RegisterUser"

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <App />
        <Snowfall snowflakeCount={60} />
      </>
    )
  },
  {
    path: "/company/register",
    element: (
      <>
        <RegisterCompany />
      </>
    )
  },
  {
    path: "/user/register",
    element: (
      <>
        <RegisterUser />
      </>
    )
  }
])

ReactDOM.createRoot(document.getElementById("root")).render(


  <Web3AuthProvider config={web3AuthContextConfig}>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <RouterProvider router={router} />
      </WagmiProvider>
    </QueryClientProvider>
  </Web3AuthProvider>

);