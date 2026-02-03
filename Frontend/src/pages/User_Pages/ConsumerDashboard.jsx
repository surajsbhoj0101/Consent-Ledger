import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Wallet from "../../components/WalletComponent";
import { Activity, ShieldCheck, BellRing, Clock3 } from "lucide-react";
import "../../index.css";
import axios from "axios";

function ConsumerDashboard() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();

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
    } catch (err) {
      setRole(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const stats = [
    {
      title: "Active Consents",
      value: "14",
      icon: <ShieldCheck size={22} />,
      trend: "+2 this week",
    },
    {
      title: "Pending Requests",
      value: "3",
      icon: <BellRing size={22} />,
      trend: "Needs review",
    },
    {
      title: "Recent Activity",
      value: "9",
      icon: <Activity size={22} />,
      trend: "Last 30 days",
    },
  ];

  const activity = [
    {
      id: 1,
      title: "Consent granted",
      detail: "Marketing Analytics",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Consent revoked",
      detail: "Partner Offers",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Request received",
      detail: "Product Research",
      time: "2 days ago",
    },
  ];

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
                    Dashboard
                  </h1>
                  <p className="text-[#9db5d6] text-xs md:text-sm mt-1">
                    Stay in control of your data permissions
                  </p>
                </div>
                <div className="z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-5 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(10,14,24,0.5)]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#9db5d6]">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-white mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#7fa4c4]/15 text-[#7fa4c4]">
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-xs text-[#9db5d6] mt-4">
                      {stat.trend}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl p-6 shadow-[0_18px_50px_rgba(10,14,24,0.5)]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Clock3 size={18} className="text-[#7fa4c4]" />
                    <h2 className="text-white font-semibold text-lg">
                      Recent Activity
                    </h2>
                  </div>
                  <span className="text-xs text-[#9db5d6]">Updated live</span>
                </div>

                <div className="space-y-3">
                  {activity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-[rgba(127,164,196,0.18)] bg-[rgba(15,23,42,0.5)] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#9db5d6]">
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-xs text-[#9db5d6]">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumerDashboard;
