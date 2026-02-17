import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Box,
  FileSignature,
  RectangleHorizontal,
  Cpu,
  MoveLeft,
  MoveRight
} from "lucide-react";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth,
} from "@web3auth/modal/react";



import { BrowserProvider } from "ethers";
import Loading from "./components/loadingComponent";


function App() {
  const orbitronStyle = { fontFamily: "Orbitron, sans-serif" };
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };

  const navigate = useNavigate();

  const { connect } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo, isLoading } = useWeb3AuthUser();
  const { isConnected, provider } = useWeb3Auth();


  const [selectedRole, setSelectedRole] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

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
      setPageLoading(true);
      setLoadingMessage("Creating account");
      if (!provider) throw new Error("Web3Auth provider not ready");
      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const walletAddress = await signer.getAddress();
      console.log(walletAddress);
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { role, walletAddress },
        {
          headers: {
            Authorization: `Bearer ${userInfo.idToken}`,
          },
          withCredentials: true,
        }
      );

      if (!res.data?.success) {
        throw new Error("Registration failed");
      }

      setTimeout(() => {
        navigate(role === "company" ? "/company/register" : "/consumer/register");
      }, 500);


    } catch (err) {
      console.error("Registration failed:", err.response?.data || err);
      disconnect();
    } finally {
      setPageLoading(false);
      setLoadingMessage("");
    }
  }

  async function checkIfAuthorized() {
    try {
      setPageLoading(true);
      setLoadingMessage("Checking session");
      const res = await axios.get('http://localhost:5000/api/auth/validate', {
        withCredentials: true
      })

      if (!res.data.data) {
        navigate('/')
      }

      if (res.data.data?.role == 'company') {
        navigate('/company/register')
      } else {
        navigate('/consumer/register')

      }
    } catch (error) {
      console.log(error)
      navigate('/');
    } finally {
      setPageLoading(false);
      setLoadingMessage("");
    }
  }

  useEffect(() => {
    checkIfAuthorized()
  }, [])



  return (
    <div
      style={robotoStyle}
      className="relative min-h-screen overflow-hidden bg-app-bg"
    >
      <Loading isLoading={isLoading || pageLoading} loadingMessage={loadingMessage} />
      <div className="absolute inset-0 bg-app-surface" />

      {/* large muted blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />


      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />


      <nav className="relative z-20">
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.04]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

        <div className="relative bg-transparent flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <span className="hidden md:block text-sm tracking-widest text-white/70">
              CONSENT LEDGER
            </span>
          </Link>

          <div className="flex items-center gap-4 md:gap-10 text-sm font-medium">            {["docs", "about"].map((path) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `
            relative transition
            ${isActive ? "text-brand" : "text-white/55 hover:text-white"}
            after:absolute after:-bottom-1 after:left-0 after:h-px
            after:bg-brand
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


      <main className="relative z-10 flex flex-col items-center px-6 py-7 text-white">
        <h1
          style={orbitronStyle}
          className="text-4xl md:text-5xl font-semibold text-center"
        >
          Consent Ledger
        </h1>

        <p className="mt-3 max-w-xl text-center text-white/45">
          Transparent, verifiable consent powered by blockchain and AI
        </p>

        <div className="mt-16 items-center
              justify-center flex flex-col md:flex-row gap-16">
          {/* Company */}
          <div
            className="
              
              group relative w-[300px] rounded-lg
              bg-white/3 backdrop-blur-md p-8
              border border-brand
              hover:shadow-[0_0_0_1px_#7fa4c4,0_0_75px_rgba(127,164,196,0.65)]
              transition-all duration-500 hover:-translate-y-1
            "
          >
            <div className="relative flex justify-center">
              <div className="absolute h-36 w-36 rounded-full bg-brand/25 blur-3xl" />
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
                bg-gradient-to-r from-brand/65 to-brand-3/65
                hover:from-brand hover:to-brand-3
                shadow-lg transition-all
              "
            >
              Login / Register
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <RectangleHorizontal
              size={280}
              strokeWidth={0.8}
              className="text-brand/30"
            />

            {/* TOP */}
            <div className="absolute top-9 left-1/2 -translate-x-1/2">
              <div className="
                relative p-2 rounded-xl bg-[#232a35]
                transition-all duration-300
                hover:scale-110
                hover:shadow-[0_0_22px_rgba(120,180,220,0.45)]
              ">
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br
                  from-[#6fb9ff]/60 to-[#cfa8ff]/55 blur-xl opacity-0
                  group-hover:opacity-100" />
                <Cpu size={40} strokeWidth={0.8} className="text-[#9ed0ff]" />
              </div>
            </div>

            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div className="
                  relative p-2 rounded-xl bg-[#232a35]
                  transition-all duration-300
                  hover:scale-110
                  hover:shadow-[0_0_22px_rgba(90,200,170,0.45)]
                ">
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br
                    from-[#5fe3c0]/60 to-[#9ddcff]/50 blur-xl opacity-0
                    group-hover:opacity-100" />
                <Building2 size={40} strokeWidth={0.8} className="text-[#7ff0d0]" />
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className="
                  relative p-2 rounded-xl bg-[#232a35]
                  transition-all duration-300
                  hover:scale-110
                  hover:shadow-[0_0_22px_rgba(210,140,200,0.45)]
                ">
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br
                from-[#e29cff]/60 to-[#ffb3d9]/55 blur-xl opacity-0
                group-hover:opacity-100" />
                <User size={40} strokeWidth={0.8} className="text-[#f2b6ff]" />
              </div>
            </div>

            <div className="absolute bottom-9 left-1/2 -translate-x-1/2">
              <div className="
                relative p-2 rounded-xl bg-[#232a35]
                transition-all duration-300
                hover:scale-110
                hover:shadow-[0_0_22px_rgba(220,160,120,0.45)]
              ">
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br
              from-[#ffb36b]/60 to-[#ff9ac1]/55 blur-xl opacity-0
              group-hover:opacity-100" />
                <Box size={40} strokeWidth={0.8} className="text-[#ffd2a1]" />
              </div>
            </div>

            <div className="
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    flex flex-col items-center leading-none
                    transition-all duration-300
                    hover:scale-110
                    hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]
                ">
              <MoveLeft size={70} strokeWidth={1.5} className="text-white/80" />
              <MoveRight size={70} strokeWidth={1.5} className="text-white/80 -mt-8" />
            </div>
          </div>


          {/* User */}
          <div
            className="
              group relative w-[300px] rounded-lg
              bg-white/2 backdrop-blur-md p-8
              border border-[#9b8fc4]
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

              onClick={() => { handleLogin("consumer") }}
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
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

        <div className="relative flex items-center justify-center h-10 text-xs text-white/40 tracking-wide">
          © {new Date().getFullYear()} Consent Ledger · Verifiable Digital Consent
        </div>
      </footer>

    </div>
  );
}

export default App;
