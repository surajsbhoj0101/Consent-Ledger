import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Wallet from "../../components/WalletComponent";
import { Search, Clock3, AlertCircle } from "lucide-react";
import "../../index.css";
import axios from "axios";
import Loading from "../../components/loadingComponent";

function ConsumerHistory() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const history = [
    {
      id: "evt-311",
      action: "Granted consent",
      purpose: "Marketing Analytics",
      time: "2026-02-03",
    },
    {
      id: "evt-310",
      action: "Revoked consent",
      purpose: "Partner Offers",
      time: "2026-02-01",
    },
    {
      id: "evt-309",
      action: "Updated profile",
      purpose: "Profile",
      time: "2026-01-29",
    },
  ];

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter((item) =>
      [item.action, item.purpose, item.id]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q)),
    );
  }, [search, history]);

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-y-auto custom-scrollbar bg-app-bg"
    >
      <Loading isLoading={isLoading} loadingMessage="Loading history" />
      <div className="absolute inset-0 bg-app-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative flex h-screen">
        <Sidebar role={role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="bg-transparent border-b border-[rgba(127,164,196,0.1)] flex-shrink-0">
              <div className="backdrop-blur-3xl bg-white/4" />
              <div className="w-full h-px bg-linear-to-r from-transparent via-brand/60 to-transparent" />
              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    History
                  </h1>
                  <p className="text-brand-muted text-xs md:text-sm mt-1">
                    A timeline of your consent actions
                  </p>
                </div>
                <div className="z-50 md:block">
                  <Wallet tone="consumer" />
                </div>
              </div>
            </div>

            <div className="p-5 mt-6 mx-4 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl shadow-[0_18px_50px_rgba(10,14,24,0.5)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-white font-bold text-2xl tracking-tight">
                    Activity History
                  </h2>
                  <p className="text-brand-muted text-sm mt-1">
                    Search or review your previous actions
                  </p>
                </div>
                <div className="relative min-w-[240px]">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search history"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/5 border border-brand/30 text-white placeholder-white/30 focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-[rgba(10,16,28,0.35)] shadow-[0_12px_40px_rgba(10,14,24,0.45)] overflow-hidden">
                <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 px-6 py-3 text-[11px] uppercase tracking-wide text-brand bg-gradient-to-r from-[rgba(127,164,196,0.12)] to-[rgba(127,164,196,0.04)] border-b border-[rgba(127,164,196,0.12)]">
                  <span>Action</span>
                  <span>Purpose</span>
                  <span>Date</span>
                </div>

                <div className="divide-y divide-[rgba(127,164,196,0.1)]">
                  {filtered.length > 0 ? (
                    filtered.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 px-6 py-4 text-sm text-brand-soft hover:bg-[rgba(127,164,196,0.08)] transition"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {item.action}
                          </p>
                          <p className="text-xs text-brand-muted">{item.id}</p>
                        </div>
                        <span>{item.purpose}</span>
                        <span className="text-xs text-brand-muted">
                          {item.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-16 text-center text-brand-muted">
                      <AlertCircle size={20} className="mx-auto mb-3" />
                      No history records found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumerHistory;
