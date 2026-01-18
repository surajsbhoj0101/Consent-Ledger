import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Box,
  FileSignature
} from "lucide-react";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth
} from "@web3auth/modal/react";

function App() {
  const orbitronStyle = { fontFamily: "Orbitron, sans-serif" };
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };

  const navigate = useNavigate();

  const { connect } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo, isLoading } = useWeb3AuthUser();
  const { isConnected } = useWeb3Auth();

  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = async (role) => {
    try {
      setSelectedRole(role);
      await connect();
    } catch (err) {
      console.error("Login failed:", err);
      disconnect();
    }
  };

  useEffect(() => {
    if (!isConnected || !userInfo || !selectedRole) return;

    handleCreateUser(userInfo, selectedRole);
  }, [isConnected, userInfo, selectedRole]);

  async function handleCreateUser(userInfo, role) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { role },
        {
          headers: {
            Authorization: `Bearer ${userInfo.idToken}`,
          },
        }
      );

      if (!res.data?.success) {
        throw new Error("Registration failed");
      }

      navigate(role === "company" ? "/company" : "/user");

    } catch (err) {
      console.error("Registration failed:", err.response?.data || err);
      disconnect();
    }
  }



  return (
    <div
      style={robotoStyle}
      className="relative min-h-screen overflow-hidden bg-[#14171d]"
    >
      <div className="absolute inset-0 bg-[#12151b]" />

      {/* large muted blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />


      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />


      <div className="absolute inset-0 pointer-events-none z-[1]">
        <FileSignature
          size={180}
          strokeWidth={0.6}
          className="absolute top-30  text-purple-200"
        />
        <Box
          size={180}
          strokeWidth={0.6}
          className="absolute top-[15%] right-4 text-indigo-400"
        />

      </div>

      <nav className="relative z-20">
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.04]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#7fa4c4]/60 to-transparent" />

        <div className="relative flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <span className="hidden md:block text-sm tracking-widest text-white/70">
              CONSENT LEDGER
            </span>
          </Link>

          <div className="flex items-center gap-10 text-sm font-medium">
            {["docs", "about"].map((path) => (
              <NavLink
                key={path}
                to={`/${path}`}
                className={({ isActive }) =>
                  `
            relative transition
            ${isActive ? "text-[#7fa4c4]" : "text-white/55 hover:text-white"}
            after:absolute after:-bottom-1 after:left-0 after:h-px
            after:bg-[#7fa4c4]
            after:transition-all
            ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
          `
                }
              >
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>


      <main className="relative z-10 flex flex-col items-center px-6 pt-16 pb-28 text-white">
        <h1
          style={orbitronStyle}
          className="text-4xl md:text-5xl font-semibold text-center"
        >
          Consent Ledger
        </h1>

        <p className="mt-3 max-w-xl text-center text-white/45">
          Transparent, verifiable consent powered by blockchain and AI
        </p>

        <div className="mt-16 flex flex-col md:flex-row gap-16">
          {/* Company */}
          <div
            className="
              group relative w-[360px] rounded-lg
              bg-white/3 backdrop-blur-2xl p-6
              border border-[#7fa4c4]
              shadow-[0_0_0_1px_#7fa4c4,0_0_40px_rgba(127,164,196,0.45)]
              hover:shadow-[0_0_0_1px_#7fa4c4,0_0_75px_rgba(127,164,196,0.65)]
              transition-all duration-500 hover:-translate-y-1
            "
          >
            <div className="relative flex justify-center">
              <div className="absolute h-36 w-36 rounded-full bg-[#7fa4c4]/25 blur-3xl" />
              <Building2
                size={120}
                strokeWidth={1.1}
                className="relative text-[#cfe3f3] drop-shadow-[0_0_14px_rgba(127,164,196,0.6)]"
              />
            </div>

            <div className="mt-6 text-center space-y-2">
              <h3 style={robotoStyle} className="text-xl tracking-wide text-white/70 font-semibold">Company Portal</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Create and manage immutable consent agreements for your organization.
              </p>
            </div>

            <button

              onClick={() => { handleLogin("company") }}
              className="
                mt-6 w-full rounded-xl py-3 text-sm font-medium
                bg-gradient-to-r from-[#7fa4c4]/65 to-[#5f88ad]/65
                hover:from-[#7fa4c4] hover:to-[#5f88ad]
                shadow-lg transition-all
              "
            >
              Login / Register
            </button>
          </div>



          {/* User */}
          <div
            className="
              group relative w-[380px] rounded-lg
              bg-white/2 backdrop-blur-xl p-8
              border border-[#9b8fc4]
              shadow-[0_0_45px_rgba(155,143,196,0.25)]
              hover:shadow-[0_0_70px_rgba(155,143,196,0.45)]
              transition-all duration-500 hover:-translate-y-1
            "
          >
            <div className="relative flex justify-center mb-6">
              <div className="absolute h-32 w-32 rounded-full bg-[#9b8fc4]/22 blur-3xl" />
              <User
                size={96}
                strokeWidth={1.1}
                className="relative text-[#e0daf6] drop-shadow-[0_0_14px_rgba(155,143,196,0.6)]"
              />
            </div>

            <h3 style={robotoStyle} className="text-xl tracking-wide font-semibold text-center">User Portal</h3>

            <p className="mt-4 text-sm text-white/50 leading-relaxed text-center">
              View, approve, and revoke consent with full transparency and control.
            </p>

            <button

              onClick={() => { handleLogin("user") }}
              className="
                mt-10 w-full rounded-xl py-3 text-sm font-medium
                bg-gradient-to-r from-[#9b8fc4]/65 to-[#b1a5da]/65
                hover:from-[#9b8fc4] hover:to-[#b1a5da]
                shadow-lg transition-all
              "
            >
              Login / Register
            </button>
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 inset-x-0 z-20">
        <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.035]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7fa4c4]/40 to-transparent" />

        <div className="relative flex items-center justify-center h-10 text-xs text-white/40 tracking-wide">
          © {new Date().getFullYear()} Consent Ledger · Verifiable Digital Consent
        </div>
      </footer>

    </div>
  );
}

export default App;
