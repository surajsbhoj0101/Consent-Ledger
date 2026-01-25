import React, { useEffect, useState } from "react";
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
} from "lucide-react";

function CompanyDashboard() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
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

  useEffect(() => {
    const handleSidebarToggle = () => {
      setSidebarOpen(localStorage.getItem("sidebarOpen") !== "false");
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  const stats = [
    {
      title: "Total Consents",
      value: "1,234",
      icon: <FileCheck size={24} />,
      change: "+12%",
      color: "from-blue-500/20 to-blue-600/10",
    },
    {
      title: "Revoked Consent",
      value: "89",
      icon: <X size={24} />,
      change: "-3%",
      color: "from-red-500/20 to-red-600/10",
    },
    {
      title: "Pending Requests",
      value: "45",
      icon: <AlertCircle size={24} />,
      change: "-5%",
      color: "from-yellow-500/20 to-yellow-600/10",
    },
    {
      title: "Expired Requests",
      value: "23",
      icon: <TrendingDown size={24} />,
      change: "+2%",
      color: "from-orange-500/20 to-orange-600/10",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "Granted Consent",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Revoked Consent",
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Requested Data",
      timestamp: "6 hours ago",
    },
    {
      id: 4,
      user: "Sarah Williams",
      action: "Updated Profile",
      timestamp: "8 hours ago",
    },
  ];

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-hidden scroll bg-[#14171d]"
    >
      <div className="absolute inset-0 bg-[#12151b]" />

      {/* large muted blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative flex h-screen">
        <Sidebar role={role} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#7fa4c4]/50 scrollbar-track-transparent hover:scrollbar-thumb-[#7fa4c4]/70 scrollbar-thumb-rounded-full">
            {/* Header */}
            <div className="bg-transparent border-b border-[rgba(127,164,196,0.1)] flex-shrink-0">
              <div className="backdrop-blur-3xl bg-white/4" />

              <div className="w-full h-px bg-linear-to-r from-transparent via-[#7fa4c4]/60 to-transparent" />

              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-[#9db5d6] text-xs md:text-sm mt-1">
                    Welcome back! Here's your consent ledger overview.
                  </p>
                </div>

                <div className=" z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Stats Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 size={24} className="text-[#7fa4c4]" />
                <h2 className="text-2xl font-bold text-white">Key Metrics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group p-6 rounded-2xl border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] hover:border-[rgba(127,164,196,0.4)] hover:shadow-xl hover:shadow-[rgba(127,164,196,0.1)] transition-all duration-300 backdrop-blur-md"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-[#9db5d6] text-xs font-semibold uppercase tracking-wide mb-2">
                          {stat.title}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-4xl font-bold text-[#7fa4c4]">
                            {stat.value}
                          </p>
                          <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-3.5 rounded-xl bg-gradient-to-br ${stat.color} text-[#7fa4c4] group-hover:scale-125 group-hover:rotate-3 transition-all duration-300`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                    <div className="h-1.5 bg-[rgba(127,164,196,0.1)] rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-[#7fa4c4] via-[#5a8ab0] to-transparent w-3/4 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Area */}
              <div className="lg:col-span-2">
                <div className="p-8 rounded-2xl border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] backdrop-blur-md hover:border-[rgba(127,164,196,0.3)] transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <TrendingDown size={24} className="text-[#7fa4c4]" />
                      <h3 className="text-lg font-bold text-gray-200">
                        Consent Trends
                      </h3>
                    </div>
                    <select className="px-4 py-2 text-sm bg-[rgba(127,164,196,0.08)] border border-[rgba(127,164,196,0.2)] rounded-lg text-[#7fa4c4] cursor-pointer hover:bg-[rgba(127,164,196,0.15)] transition-all font-medium">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                  <div className="h-72 flex items-center justify-center rounded-lg bg-[rgba(127,164,196,0.05)] border border-dashed border-[rgba(127,164,196,0.2)]">
                    <div className="text-center">
                      <BarChart3
                        size={64}
                        className="text-[#7fa4c4]/20 mx-auto mb-4"
                      />
                      <p className="text-[#9db5d6]">
                        Chart visualization coming soon
                      </p>
                      <p className="text-[#6b92b0] text-sm mt-2">
                        Data will display here
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-8 rounded-2xl border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] backdrop-blur-md hover:border-[rgba(127,164,196,0.3)] transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <Clock size={24} className="text-[#7fa4c4]" />
                  <h3 className="text-lg font-bold text-gray-200">
                    Recent Activity
                  </h3>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 rounded-xl bg-linear-to-r from-[rgba(127,164,196,0.08)] to-[rgba(127,164,196,0.02)] border border-[rgba(127,164,196,0.1)] hover:border-[rgba(127,164,196,0.25)] hover:bg-[rgba(127,164,196,0.12)] transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#7fa4c4] group-hover:text-white transition-colors truncate">
                            {activity.user}
                          </p>
                          <p className="text-xs text-[#9db5d6] mt-1.5">
                            {activity.action}
                          </p>
                        </div>
                        <p className="text-xs text-[#6b92b0] whitespace-nowrap font-medium ml-2">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Activity size={24} className="text-[#7fa4c4]" />
                <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <button className="group p-6 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(127,164,196,0.12)] to-[rgba(127,164,196,0.04)] hover:border-[rgba(127,164,196,0.4)] hover:from-[rgba(127,164,196,0.18)] hover:to-[rgba(127,164,196,0.08)] transition-all text-left hover:shadow-lg hover:shadow-[rgba(127,164,196,0.1)]">
                  <p className="text-[#7fa4c4] font-bold text-base group-hover:text-white transition-colors">
                    ➕ Create Consent Form
                  </p>
                  <p className="text-[#9db5d6] text-sm mt-2 group-hover:text-[#7fa4c4] transition-colors">
                    Set up a new consent request
                  </p>
                </button>
                <button className="group p-6 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(127,164,196,0.12)] to-[rgba(127,164,196,0.04)] hover:border-[rgba(127,164,196,0.4)] hover:from-[rgba(127,164,196,0.18)] hover:to-[rgba(127,164,196,0.08)] transition-all text-left hover:shadow-lg hover:shadow-[rgba(127,164,196,0.1)]">
                  <p className="text-[#7fa4c4] font-bold text-base group-hover:text-white transition-colors">
                    👥 Manage Users
                  </p>
                  <p className="text-[#9db5d6] text-sm mt-2 group-hover:text-[#7fa4c4] transition-colors">
                    View and manage user accounts
                  </p>
                </button>
                <button className="group p-6 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(127,164,196,0.12)] to-[rgba(127,164,196,0.04)] hover:border-[rgba(127,164,196,0.4)] hover:from-[rgba(127,164,196,0.18)] hover:to-[rgba(127,164,196,0.08)] transition-all text-left hover:shadow-lg hover:shadow-[rgba(127,164,196,0.1)]">
                  <p className="text-[#7fa4c4] font-bold text-base group-hover:text-white transition-colors">
                    📋 View Reports
                  </p>
                  <p className="text-[#9db5d6] text-sm mt-2 group-hover:text-[#7fa4c4] transition-colors">
                    Check compliance reports
                  </p>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
