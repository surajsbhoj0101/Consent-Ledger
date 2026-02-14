import React, { useState } from "react";
import { Wallet, CircleCheck, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { useAccount } from "wagmi";

function WalletComponent({ tone = "company" }) {
  const  navigate  = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const isConsumer = tone === "consumer";

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

  const { address } = useAccount();

  const accent = "#7fa4c4";
  const connectFrom = "#7fa4c4";
  const connectTo = "#5a8aac";
  const connectHoverFrom = "#8fb4d4";
  const connectHoverTo = "#6a9abc";
  const dropdownBgClass =
    "absolute right-0 mt-2 w-56 border rounded-lg shadow-xl overflow-hidden z-50 backdrop-blur-md bg-gradient-to-b from-app-bg/90 to-app-bg-deep/90";

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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: `${accent}1a`,
                    border: `1px solid ${accent}4d`,
                  }}
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
                  <div
                    className={dropdownBgClass}
                    style={{ borderColor: `${accent}66` }}
                  >
                    <div className="px-4 py-3 border-b rounded-t-lg" style={{ borderColor: `${accent}4d`, backgroundColor: `${accent}0d` }}>
                      <p className="text-xs text-white/50 mb-1">Connected as</p>
                      <p className="text-sm text-white font-mono break-all">
                        {address}
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b" style={{ borderColor: `${accent}4d` }}>
                      <p className="text-xs text-white/50 mb-1">Network</p>
                      <p className="text-sm capitalize" style={{ color: accent }}>
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
                      <div className="px-4 py-2 bg-red-500/10 text-red-400 text-xs border-t" style={{ borderColor: `${accent}4d` }}>
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
                  className="px-6 py-2 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    background: `linear-gradient(to right, ${connectFrom}, ${connectTo})`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(to right, ${connectHoverFrom}, ${connectHoverTo})`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(to right, ${connectFrom}, ${connectTo})`;
                  }}
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
