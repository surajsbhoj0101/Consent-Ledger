import "./index.css";
import ReactDOM from "react-dom/client";
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./context/web3AuthContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Snowfall from "react-snowfall";

import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import RegisterCompany from "./pages/company/RegisterCompany";
import RegisterConsumer from "./pages/consumer/RegisterConsumer";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import ConsentPurposes from "./pages/company/ConsentPurposes";
import ConsentRequest from "./pages/company/ConsentRequest";
import ManageUsers from "./pages/company/ManageUsers";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanySettings from "./pages/company/CompanySettings";
import AuditLogs from "./pages/company/AuditLogs";
import ConsumerDashboard from "./pages/consumer/ConsumerDashboard";
import MyConsents from "./pages/consumer/MyConsents";
import ConsumerHistory from "./pages/consumer/ConsumerHistory";
import ConsumerProfile from "./pages/consumer/ConsumerProfile";
import ConsumerSettings from "./pages/consumer/ConsumerSettings";

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
    path: "/consumer/dashboard",
    element: (
      <>
        <ConsumerDashboard />
      </>
    ),
  },
  {
    path: "/consumer/consents",
    element: (
      <>
        <MyConsents />
      </>
    ),
  },
  {
    path: "/consumer/history",
    element: (
      <>
        <ConsumerHistory />
      </>
    ),
  },
  {
    path: "/consumer/profile",
    element: (
      <>
        <ConsumerProfile />
      </>
    ),
  },
  {
    path: "/consumer/settings",
    element: (
      <>
        <ConsumerSettings />
      </>
    ),
  },
  {
    path: "/company/dashboard",
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
  {
    path: "/company/profile",
    element: (
      <>
        <CompanyProfile />
      </>
    ),
  },
  {
    path: "/company/settings",
    element: (
      <>
        <CompanySettings />
      </>
    ),
  },
  {
    path: "/company/audit-logs",
    element: (
      <>
        <AuditLogs />
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
