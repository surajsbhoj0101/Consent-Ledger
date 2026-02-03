import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Wallet from "../../components/WalletComponent";
import { BellRing, ShieldCheck, Eye, Lock, Check } from "lucide-react";
import "../../index.css";
import axios from "axios";

function ConsumerSettings() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/validate", {
          withCredentials: true,
        });
        const role = res.data?.data?.role;
        if (role === "consumer" || role === "company") {
          setRole(role);
        } else {
          setRole(null);
        }
      } catch (err) {
        setRole(null);
      }
    };
    getUser();
  }, []);

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-y-auto custom-scrollbar bg-[#14171d]"
    >
      <div className="absolute inset-0 bg-[#12151b]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative flex h-screen">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="bg-transparent border-b border-[rgba(127,164,196,0.1)] flex-shrink-0">
              <div className="backdrop-blur-3xl bg-white/4" />
              <div className="w-full h-px bg-linear-to-r from-transparent via-[#7fa4c4]/60 to-transparent" />
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Settings
                  </h1>
                  <p className="text-[#9db5d6] text-xs md:text-sm mt-1">
                    Manage notifications, privacy, and security
                  </p>
                </div>
                <div className="z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-5 mt-6 mx-4 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl shadow-[0_18px_50px_rgba(10,14,24,0.5)] space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-[rgba(15,23,42,0.55)] p-5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <BellRing size={18} className="text-[#7fa4c4]" />
                    Notifications
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-[#9db5d6]">
                    <label className="flex items-center justify-between gap-3">
                      Email alerts
                      <input type="checkbox" className="accent-[#7fa4c4]" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      Consent updates
                      <input type="checkbox" className="accent-[#7fa4c4]" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      Weekly summary
                      <input type="checkbox" className="accent-[#7fa4c4]" />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-[rgba(15,23,42,0.55)] p-5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <ShieldCheck size={18} className="text-[#7fa4c4]" />
                    Security
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-[#9db5d6]">
                    <label className="flex items-center justify-between gap-3">
                      Two-factor authentication
                      <input type="checkbox" className="accent-[#7fa4c4]" />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      Login alerts
                      <input type="checkbox" className="accent-[#7fa4c4]" defaultChecked />
                    </label>
                    <button className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#7fa4c4]/40 text-xs text-white bg-[#7fa4c4]/15">
                      <Lock size={14} className="text-[#7fa4c4]" />
                      Manage devices
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-[rgba(15,23,42,0.55)] p-5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Eye size={18} className="text-[#7fa4c4]" />
                    Privacy
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-[#9db5d6]">
                    <label className="flex items-center justify-between gap-3">
                      Hide profile from partners
                      <input type="checkbox" className="accent-[#7fa4c4]" />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      Require confirmation on revoke
                      <input type="checkbox" className="accent-[#7fa4c4]" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                      Share anonymized analytics
                      <input type="checkbox" className="accent-[#7fa4c4]" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7fa4c4] to-[#6b8fb0] text-white text-sm font-semibold hover:shadow-[0_0_25px_rgba(127,164,196,0.6)] transition">
                  <Check size={16} />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumerSettings;
