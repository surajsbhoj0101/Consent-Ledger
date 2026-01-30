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
import RegisterCompany from "./pages/Company_Pages/RegisterCompany";
import RegisterConsumer from "./pages/User_Pages/RegisterConsumer";
import CompanyDashboard from "./pages/Company_Pages/CompanyDashboard";
import ConsentPurposes from "./pages/Company_Pages/ConsentPurposes";
import ConsentRequest from "./pages/Company_Pages/ConsentRequest";
import ManageUsers from "./pages/Company_Pages/ManageUsers";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <App />
        <Snowfall snowflakeCount={60} />
      </>
    ),
  },
  {
    path: "/company/register",
    element: (
      <>
        <RegisterCompany />
      </>
    ),
  },
  {
    path: "/consumer/register",
    element: (
      <>
        <RegisterConsumer />
      </>
    ),
  },
  {
    path: "/company/Dashboard",
    element: (
      <>
        <CompanyDashboard />
      </>
    ),
  },
  {
    path: "/company/users",
    element: (
      <>
        <ManageUsers />
      </>
    ),
  },
  {
    path: "/company/purposes",
    element: (
      <>
        <ConsentPurposes />
      </>
    ),
  },
  {
    path: "/company/consent-request",
    element: (
      <>
        <ConsentRequest />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Web3AuthProvider config={web3AuthContextConfig}>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <RouterProvider router={router} />
      </WagmiProvider>
    </QueryClientProvider>
  </Web3AuthProvider>,
);
