import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Wallet from "../../components/WalletComponent";
import { Search, ShieldCheck, Filter, Clock, UserCheck } from "lucide-react";
import "../../index.css";

function AuditLogs() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const logs = [
    {
      id: "log-1021",
      actor: "John Doe",
      action: "Consent Granted",
      status: "Success",
      timestamp: "2026-02-03 09:14",
      details: "Marketing Analytics (12 months)",
    },
    {
      id: "log-1020",
      actor: "Jane Smith",
      action: "Consent Revoked",
      status: "Success",
      timestamp: "2026-02-03 08:42",
      details: "Product Research (6 months)",
    },
    {
      id: "log-1019",
      actor: "System",
      action: "Request Sent",
      status: "Queued",
      timestamp: "2026-02-03 08:10",
      details: "Q1 Analytics Consent",
    },
    {
      id: "log-1018",
      actor: "Alex Ray",
      action: "Profile Updated",
      status: "Success",
      timestamp: "2026-02-02 21:55",
      details: "Company profile details updated",
    },
  ];

  useEffect(() => {
    setRole("company");
  }, []);

  const filtered = useMemo(() => {
    let result = [...logs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((log) =>
        [log.actor, log.action, log.details, log.id]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q)),
      );
    }

    if (actionFilter !== "all") {
      result = result.filter(
        (log) => log.action.toLowerCase() === actionFilter,
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (log) => log.status.toLowerCase() === statusFilter,
      );
    }

    return result;
  }, [logs, search, actionFilter, statusFilter]);

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-y-auto custom-scrollbar bg-app-bg"
    >
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
                    Audit Logs
                  </h1>
                  <p className="text-brand-muted text-xs md:text-sm mt-1">
                    Review every consent event and system action
                  </p>
                </div>
                <div className="z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-5 mt-6 mx-4 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl hover:border-brand/60 transition-all duration-300 shadow-[0_18px_50px_rgba(10,14,24,0.5)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-2xl tracking-tight">
                    Activity Stream
                  </h2>
                  <p className="text-brand-muted text-sm mt-1">
                    Search and filter activity across your organization
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                  <Clock size={14} className="text-brand" />
                  Updated moments ago
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="relative lg:col-span-2">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by user, action, or log ID"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/5 border border-brand/30 text-white placeholder-white/30 focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg bg-white/5 border border-brand/30 text-white focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300"
                  >
                    <option value="all" className="bg-panel">
                      All actions
                    </option>
                    <option value="consent granted" className="bg-panel">
                      Consent granted
                    </option>
                    <option value="consent revoked" className="bg-panel">
                      Consent revoked
                    </option>
                    <option value="request sent" className="bg-panel">
                      Request sent
                    </option>
                    <option value="profile updated" className="bg-panel">
                      Profile updated
                    </option>
                  </select>
                </div>

                <div className="relative">
                  <ShieldCheck
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg bg-white/5 border border-brand/30 text-white focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300"
                  >
                    <option value="all" className="bg-panel">
                      All statuses
                    </option>
                    <option value="success" className="bg-panel">
                      Success
                    </option>
                    <option value="queued" className="bg-panel">
                      Queued
                    </option>
                    <option value="failed" className="bg-panel">
                      Failed
                    </option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-[rgba(10,16,28,0.35)] shadow-[0_12px_40px_rgba(10,14,24,0.45)] overflow-hidden">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_auto] items-center gap-3 px-6 py-3 text-[11px] uppercase tracking-wide text-brand bg-gradient-to-r from-[rgba(127,164,196,0.12)] to-[rgba(127,164,196,0.04)] border-b border-[rgba(127,164,196,0.12)]">
                  <span>User</span>
                  <span>Action</span>
                  <span>Details</span>
                  <span>Timestamp</span>
                  <span>Status</span>
                </div>

                <div className="divide-y divide-[rgba(127,164,196,0.1)]">
                  {filtered.length > 0 ? (
                    filtered.map((log) => (
                      <div
                        key={log.id}
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_auto] items-center gap-3 px-6 py-4 text-sm text-brand-soft hover:bg-[rgba(127,164,196,0.08)] transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-[rgba(127,164,196,0.15)] flex items-center justify-center">
                            <UserCheck size={14} className="text-brand" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">
                              {log.actor}
                            </p>
                            <p className="text-xs text-brand truncate">
                              {log.id}
                            </p>
                          </div>
                        </div>
                        <span className="text-white font-medium">
                          {log.action}
                        </span>
                        <span className="text-xs text-brand-muted">
                          {log.details}
                        </span>
                        <span className="text-xs text-brand-muted">
                          {log.timestamp}
                        </span>
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full justify-self-end ${
                            log.status === "Success"
                              ? "bg-green-500/20 text-green-300"
                              : log.status === "Queued"
                                ? "bg-yellow-500/20 text-yellow-300"
                                : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-16 text-center text-brand-muted">
                      No activity matches your filters.
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

export default AuditLogs;
