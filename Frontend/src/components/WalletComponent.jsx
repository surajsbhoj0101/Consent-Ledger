import React, { useState } from "react";
import { Wallet,CircleCheck, LogOut, ChevronDown, LogIn } from "lucide-react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import axios from "axios";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import { useAccount } from "wagmi";

function WalletComponent() {
  const  navigate  = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    connect,
    isConnected,
    connectorName,
    loading: connectLoading,
    error: connectError,
  } = useWeb3AuthConnect();

  const {
    disconnect,
    loading: disconnectLoading,
    error: disconnectError,
  } = useWeb3AuthDisconnect();

  const { userInfo } = useWeb3AuthUser();
  const { address } = useAccount();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });

      if (!res.data.success) {
        console.log("Clearing cookie failed");
        return;
      }

      disconnect();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const truncateAddress = (addr) => {
    return `${addr?.slice(0, 4)}...${addr?.slice(-4)}`;
  };

  return (
    <div className="fixed top-5.5 right-4">
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#7fa4c4]/10 hover:bg-[#7fa4c4]/20 border border-[#7fa4c4]/30 rounded-lg transition-all"
                >
                  <Wallet className="text-gray-300"/>
                  <span className="text-sm text-gray-300">
                    {truncateAddress(address)}
                  </span>
                  <CircleCheck 
                  className="text-green-400 animate-pulse" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#12151b]/95 border border-[#7fa4c4]/40 rounded-lg shadow-xl overflow-hidden z-50 backdrop-blur-md bg-gradient-to-b from-[#14171d]/90 to-[#0f1219]/90">
                    <div className="px-4 py-3 border-b border-[#7fa4c4]/30 bg-[#7fa4c4]/5">
                      <p className="text-xs text-white/50 mb-1">Connected as</p>
                      <p className="text-sm text-white font-mono break-all">
                        {address}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b border-[#7fa4c4]/30">
                      <p className="text-xs text-white/50 mb-1">Network</p>
                      <p className="text-sm text-[#7fa4c4] capitalize">
                        {connectorName || "Web3Auth"}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      disabled={disconnectLoading}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="w-4 h-4" />
                      {disconnectLoading ? "Disconnecting..." : "Logout"}
                    </button>

                    {disconnectError && (
                      <div className="px-4 py-2 bg-red-500/10 text-red-400 text-xs border-t border-[#7fa4c4]/30">
                        {disconnectError.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => connect()}
                disabled={connectLoading}
                className="px-6 py-2 bg-gradient-to-r from-[#7fa4c4] to-[#5a8aac] hover:from-[#8fb4d4] hover:to-[#6a9abc] text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {connectLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            )}

            {connectError && !isConnected && (
              <div className="text-red-400 text-xs hidden md:block">
                {connectError.message}
              </div>
            )}
          </div>
        
    
    </div>
  );
}

export default WalletComponent;
