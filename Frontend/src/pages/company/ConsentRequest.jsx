import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Wallet from "../../components/WalletComponent";
import {
  FileCheck,
  AlertCircle,
  Search,
  UserCheck,
  ClipboardList,
  Send,
} from "lucide-react";
import "../../index.css";
import NoticeBar from "../../components/NoticeBar";
import Loading from "../../components/loadingComponent";

function ConsentRequest() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
  const [notice, setNotice] = useState("");
  const [redNotice, setRedNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [users, setUsers] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [requestDetails, setRequestDetails] = useState({
    title: "",
    message: "",
    dueDate: "",
  });

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

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage("Loading users");
      const res = await axios.get(
        "http://localhost:5000/api/company/fetch-users",
        { withCredentials: true },
      );

      if (!res.data?.success) {
        setRedNotice(true);
        setNotice(res.data?.message || "Failed to fetch users");
        return;
      }

      const payload = (res.data.users || []).map((u) => ({
        id: u?.externalUserId,
        name: u?.name,
        email: u?.email,
        status: u?.status,
      }));

      setUsers(payload);
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message || "Server error while fetching users",
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const fetchPurposes = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage("Loading purposes");
      const res = await axios.get(
        "http://localhost:5000/api/company/consent-purposes",
        { withCredentials: true },
      );

      if (!res.data?.success) {
        setRedNotice(true);
        setNotice(res.data?.message || "Failed to fetch purposes");
        return;
      }

      const payload = (res.data.purposes || []).map((purpose) => ({
        id: purpose?._id,
        name: purpose?.name,
        description: purpose?.description,
        consentType: purpose?.consentType,
        duration: purpose?.duration,
        status: purpose?.status,
      }));

      setPurposes(payload);
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message ||
          "Server error while fetching purposes",
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    getUser();
    fetchUsers();
    fetchPurposes();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      result = result.filter((user) =>
        [user.name, user.email, user.id]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [users, userSearch]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const togglePurpose = (purposeId) => {
    setSelectedPurposes((prev) =>
      prev.includes(purposeId)
        ? prev.filter((id) => id !== purposeId)
        : [...prev, purposeId],
    );
  };

  const allUsersSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selectedUsers.includes(user.id));

  const handleSelectAllUsers = () => {
    if (allUsersSelected) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !filteredUsers.some((user) => user.id === id)),
      );
      return;
    }

    setSelectedUsers((prev) => {
      const next = new Set(prev);
      filteredUsers.forEach((user) => next.add(user.id));
      return Array.from(next);
    });
  };

  const canSend =
    selectedUsers.length > 0 &&
    selectedPurposes.length > 0 &&
    requestDetails.title.trim();

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-y-auto custom-scrollbar bg-app-bg"
    >
      <div className="absolute inset-0 bg-app-surface" />
      <NoticeBar notice={notice} redNotice={redNotice} onClick={setNotice} />
      <Loading isLoading={isLoading} loadingMessage={loadingMessage} />

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

              <div className="w-full h-px bg-linear-to-r from-transparent via-brand/60 to-transparent" />

              <div className="flex items-center justify-between px-4 md:px-8 py-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Request Consents
                  </h1>
                  <p className="text-brand-muted text-xs md:text-sm mt-1">
                    Request consents from your users
                  </p>
                </div>

                <div className=" z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 mt-6 mx-4 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl hover:border-brand/60 transition-all duration-300 shadow-[0_18px_50px_rgba(10,14,24,0.5)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-2xl tracking-tight">
                    Create Consent Request
                  </h2>
                  <p className="text-brand-muted text-sm mt-1">
                    Select recipients, choose purposes, and send consent requests
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.6)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] p-5 shadow-[0_12px_40px_rgba(10,14,24,0.45)] backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="text-brand" size={18} />
                        <h3 className="text-white font-semibold">
                          Select Users
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleSelectAllUsers}
                        className="text-xs text-brand hover:text-white transition"
                      >
                        {allUsersSelected ? "Clear selection" : "Select all"}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="relative flex-1">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Search by name, email, or ID"
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/5 border border-brand/30 text-white placeholder-white/30 focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300"
                        />
                      </div>
                      <span className="text-xs text-brand-muted">
                        {selectedUsers.length} selected
                      </span>
                    </div>

                    <div className="mt-4 rounded-lg border border-[rgba(127,164,196,0.12)] overflow-hidden">
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-wide text-brand bg-gradient-to-r from-[rgba(127,164,196,0.12)] to-[rgba(127,164,196,0.04)] border-b border-[rgba(127,164,196,0.12)]">
                        <span />
                        <span>User</span>
                        <span>Email / ID</span>
                        <span className="text-right">Status</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-2 p-3">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <label
                            key={user.id}
                            className={`grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${
                              selectedUsers.includes(user.id)
                                ? "border-brand bg-[rgba(127,164,196,0.16)] shadow-lg"
                                : "border-[rgba(127,164,196,0.12)] bg-[rgba(15,23,42,0.4)] hover:border-[rgba(127,164,196,0.35)]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUser(user.id)}
                              className="h-4 w-4 accent-brand"
                            />
                            <div className="min-w-0">
                              <p className="text-sm text-white font-medium truncate">
                                {user.name || "Unnamed user"}
                              </p>
                              <p className="text-xs text-brand-muted truncate">
                                {user.id}
                              </p>
                            </div>
                            <p className="text-xs text-brand-soft truncate">
                              {user.email || "No email"}
                            </p>
                            <span
                              className={`ml-auto text-xs px-2.5 py-1 rounded-full ${
                                user.status === "Active"
                                  ? "bg-green-500/20 text-green-300"
                                  : user.status === "Invited"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-slate-500/20 text-slate-300"
                              }`}
                            >
                              {user.status || "Unknown"}
                            </span>
                          </label>
                        ))
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-12 text-center">
                          <AlertCircle size={20} className="text-brand" />
                          <p className="text-sm text-brand-soft">
                            No users match your search
                          </p>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.6)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] p-5 shadow-[0_12px_40px_rgba(10,14,24,0.45)] backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="text-brand" size={18} />
                      <h3 className="text-white font-semibold">
                        Choose Consent Purposes
                      </h3>
                    </div>
                    <p className="text-xs text-brand-muted mt-1">
                      Select one or more purposes to request consent for.
                    </p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {purposes.length > 0 ? (
                        purposes.map((purpose) => {
                          const isSelected = selectedPurposes.includes(
                            purpose.id,
                          );
                          return (
                            <button
                              key={purpose.id}
                              type="button"
                              onClick={() => togglePurpose(purpose.id)}
                              className={`text-left p-4 rounded-xl border transition ${
                                isSelected
                                  ? "border-brand bg-[rgba(127,164,196,0.18)]"
                                  : "border-[rgba(127,164,196,0.12)] bg-[rgba(15,23,42,0.4)] hover:border-[rgba(127,164,196,0.35)]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-white font-semibold">
                                  {purpose.name}
                                </p>
                                <span
                                  className={`text-[11px] px-2.5 py-1 rounded-full ${
                                    purpose.consentType === "Required"
                                      ? "bg-blue-500/20 text-blue-300"
                                      : "bg-yellow-500/20 text-yellow-300"
                                  }`}
                                >
                                  {purpose.consentType || "Optional"}
                                </span>
                              </div>
                              <p className="text-xs text-brand-muted mt-2 line-clamp-2">
                                {purpose.description}
                              </p>
                              <p className="text-[11px] text-brand mt-3">
                                Duration: {purpose.duration || "12 months"}
                              </p>
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-full flex flex-col items-center gap-2 py-10 text-center">
                          <AlertCircle size={20} className="text-brand" />
                          <p className="text-sm text-brand-soft">
                            No consent purposes available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.6)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] p-5 shadow-[0_12px_40px_rgba(10,14,24,0.45)] backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <FileCheck className="text-brand" size={18} />
                      <h3 className="text-white font-semibold">
                        Request Details
                      </h3>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="text-xs text-brand font-semibold">
                          Request Title
                        </label>
                        <input
                          type="text"
                          value={requestDetails.title}
                          onChange={(e) =>
                            setRequestDetails((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="e.g., Q1 Analytics Consent"
                          className="mt-1 w-full rounded-lg bg-white/5 border border-brand/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-brand font-semibold">
                          Message to Users
                        </label>
                        <textarea
                          value={requestDetails.message}
                          onChange={(e) =>
                            setRequestDetails((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }
                          placeholder="Explain why you're requesting consent and how data will be used."
                          rows={4}
                          className="mt-1 w-full rounded-lg bg-white/5 border border-brand/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300 resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-brand font-semibold">
                          Response Due Date
                        </label>
                        <input
                          type="date"
                          value={requestDetails.dueDate}
                          onChange={(e) =>
                            setRequestDetails((prev) => ({
                              ...prev,
                              dueDate: e.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-lg bg-white/5 border border-brand/30 px-4 py-3 text-sm text-white focus:bg-white/8 focus:border-brand focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.6)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] p-5 shadow-[0_12px_40px_rgba(10,14,24,0.45)] backdrop-blur-xl">
                    <h3 className="text-white font-semibold">Request Summary</h3>
                    <div className="mt-4 space-y-3 text-sm text-brand-muted">
                      <div className="flex items-center justify-between">
                        <span>Recipients</span>
                        <span className="text-white font-semibold">
                          {selectedUsers.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Purposes</span>
                        <span className="text-white font-semibold">
                          {selectedPurposes.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Due Date</span>
                        <span className="text-white font-semibold">
                          {requestDetails.dueDate || "Not set"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!canSend}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand to-brand-2 hover:shadow-lg hover:shadow-[rgba(127,164,196,0.25)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                      Send Consent Request
                    </button>
                    <p className="mt-3 text-xs text-[#6b92b0]">
                      Sending is UI-only in this view.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentRequest;
