import "./index.css";

import ReactDOM from "react-dom/client";
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./context/web3AuthContext";
import { BrowserRouter } from "react-router-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import Navbar from "./components/Navbar";
import Company from "./pages/Company";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    )
  },
  {
    path: "/company",
    element: (
      <>
        <Navbar />
        <Company />
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