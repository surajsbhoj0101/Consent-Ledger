import React, { act, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Wallet from "../../components/WalletComponent";
import {
  TrendingDown,
  Users,
  FileCheck,
  AlertCircle,
  X,
  BarChart3,
  Clock,
  Activity,
  CirclePlus,
  NotepadText,
  Plus,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import "../../index.css";

function ConsentRequest() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
  const [createPurposeOpen, setCreatePurposeOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("sidebarOpen") !== "false",
  );

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/validate", {
        withCredentials: true,
      });

      if (!res.data?.success) {
        setRole(null);
        return;
      }

      const role = res.data?.data?.role;

      if (role === "consumer" || role === "company") {
        setRole(role);
      } else {
        setRole(null);
      }
      console.log(role);
    } catch (err) {
      setRole(null);
    }
  };

  useEffect(() => {
    getUser();
  }, [role]);

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-y-auto custom-scrollbar bg-[#14171d]"
    >
      <div className="absolute inset-0 bg-[#12151b]" />

      {/* large muted blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative flex h-screen">
        <Sidebar role={role} />

        <div className="flex-1 flex flex-col  overflow-hidden">
          <div className="flex-1 overflow-y-auto  custom-scrollbar">
            {/* Header */}
            <div className="bg-transparent border-b border-[rgba(127,164,196,0.1)] flex-shrink-0">
              <div className="backdrop-blur-3xl bg-white/4" />

              <div className="w-full h-px bg-linear-to-r from-transparent via-[#7fa4c4]/60 to-transparent" />

              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Request Consents
                  </h1>
                  <p className="text-[#9db5d6] text-xs md:text-sm mt-1">
                    Request Consents from your users
                  </p>
                </div>

                <div className=" z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-3 mt-6 mx-4 rounded-lg border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] backdrop-blur-md hover:border-[rgba(127,164,196,0.3)] transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-2xl tracking-tight">
                    Consent Purposes
                  </h2>
                  <p className="text-[#9db5d6] text-sm mt-1">
                    Manage data usage purposes and consent requirements
                  </p>
                </div>
                <button
                  onClick={() => setCreatePurposeOpen((prev) => !prev)}
                  className="
                              group inline-flex items-center gap-2
                                  rounded-lg px-5 h-11
                                  bg-gradient-to-r from-[#7fa4c4] to-[#6b8fb0]
                                  text-sm font-semibold text-white
                                  border border-[rgba(255,255,255,0.1)]
                                  hover:shadow-lg hover:shadow-[rgba(127,164,196,0.3)]
                                  hover:scale-105
                                  transition-all duration-200
                                  tracking-tight
                                  cursor-pointer
                              "
                >
                  <Plus size={18} />
                  <span>Create Purpose</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentRequest;
