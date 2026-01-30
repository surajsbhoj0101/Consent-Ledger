import React, { act, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Wallet from "../../components/WalletComponent";
import UseSearchFilter from "../../components/useSearchFilter";
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
  UserPlus,
} from "lucide-react";
import "../../index.css";

function ManageUsers() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addSingleUserOpen, setAddSingleUserOpen] = useState(false);
  const [addMultipleUserOpen, setAddMultipleUserOpen] = useState(false);
  const [searchData, setSearchData] = useState({
    search: "",
    sortBy: "",
    sortOrder: "",
  });

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

  const users = [
    {
      id: "EMP-001",
      name: "Rahul Sharma",
      email: "rahul@company.com",
      role: "Admin",
      status: "Active",
      joinedAt: "2024-10-12",
    },
    {
      id: "EMP-002",
      name: "Ananya Verma",
      email: "ananya@company.com",
      role: "User",
      status: "Invited",
      joinedAt: "—",
    },
    {
      id: "EMP-003",
      name: "Amit Singh",
      email: "amit@company.com",
      role: "Viewer",
      status: "Inactive",
      joinedAt: "2024-06-01",
    },
    {
      id: "EMP-004",
      name: "Neha Gupta",
      email: "neha@company.com",
      role: "User",
      status: "Active",
      joinedAt: "2024-08-19",
    },
  ];

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
                    Manage User
                  </h1>
                  <p className="text-[#9db5d6] text-xs md:text-sm mt-1">
                    Add, view, or remove users linked to your organization
                  </p>
                </div>

                <div className=" z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-5 mt-6 mx-4 rounded-lg border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] backdrop-blur-md hover:border-[rgba(127,164,196,0.3)] transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-2xl tracking-tight">
                    Users
                  </h2>
                  <p className="text-[#9db5d6] text-sm mt-1">
                    Manage data usage purposes and consent requirements
                  </p>
                </div>
                <button
                  onClick={() => setAddUserOpen((prev) => !prev)}
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
                                  cursor-pointer "
                >
                  <Plus size={18} />
                  <span>Add Users</span>
                </button>
              </div>

              {/* Search filter component */}
              <div>
                <UseSearchFilter value={searchData} onChange={setSearchData} />
              </div>
              <div className="rounded-lg mt-3 overflow-hidden border border-[rgba(127,164,196,0.1)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[rgba(127,164,196,0.1)] to-[rgba(127,164,196,0.05)] border-b border-[rgba(127,164,196,0.1)]">
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        User
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[rgba(127,164,196,0.1)]">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-[rgba(127,164,196,0.08)] transition-colors duration-150 group"
                        >
                          {/* User */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-white font-medium group-hover:text-[#7fa4c4] transition-colors">
                                {user.name}
                              </span>
                              <span className="text-xs text-[#9db5d6]">
                                {user.id}
                              </span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-[#b0c5db] text-xs">
                            {user.email}
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "Admin"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : user.role === "Viewer"
                                    ? "bg-sky-500/20 text-sky-300"
                                    : "bg-blue-500/20 text-blue-300"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                user.status === "Active"
                                  ? "bg-green-500/20 text-green-300"
                                  : user.status === "Invited"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>

                          {/* Joined */}
                          <td className="px-6 py-4 text-[#b0c5db] text-xs">
                            {user.joinedAt}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-[rgba(127,164,196,0.2)] rounded-lg transition-colors text-[#7fa4c4]">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 hover:bg-[rgba(127,164,196,0.2)] rounded-lg transition-colors text-[#7fa4c4]">
                                <Edit2 size={16} />
                              </button>
                              <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-36 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={24} className="text-[#7fa4c4]" />
                            <p className="text-[#b0c5db]">No users added yet</p>
                            <p className="text-xs text-[#9db5d6]">
                              Add users to start sending consent requests
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {addUserOpen && (
          <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 backdrop-blur-sm p-4 md:p-6 pt-20">
            {/* Small Panel */}
            <div className="w-full max-w-2xl rounded-xl border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] border-white/10 shadow-2xl animate-in slide-in-from-right-6 fade-in duration-200">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Add Users
                </h3>
                <button
                  onClick={() => {
                    setAddUserOpen(false);
                    handleReset();
                  }}
                  className="text-[#9db5d6] hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Single User */}
                  <button
                    onClick={() => {
                      setAddSingleUserOpen((prev) => !prev);
                    }}
                    className="
                        group relative p-5 rounded-xl text-left
                        border border-[rgba(127,164,196,0.15)]
                        bg-[rgba(15,23,42,0.5)]
                        hover:bg-[rgba(15,23,42,0.7)]
                        hover:border-[rgba(127,164,196,0.3)]
                        transition-all duration-200
                        "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex h-11 w-11 items-center justify-center rounded-lg
                          bg-blue-500/15 text-blue-400
                          group-hover:bg-blue-500/25 transition
                        "
                      >
                        <UserPlus size={20} />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Add Single User
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Invite one user via email or identifier
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Batch Users */}
                  <button
                    onClick={() => {
                      setAddMultipleUserOpen((prev) => !prev);
                    }}
                    className="
                      group relative p-5 rounded-xl text-left
                      border border-[rgba(127,164,196,0.15)]
                      bg-[rgba(15,23,42,0.5)]
                      hover:bg-[rgba(15,23,42,0.7)]
                      hover:border-[rgba(127,164,196,0.3)]
                      transition-all duration-200
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex h-11 w-11 items-center justify-center rounded-lg
                          bg-indigo-500/15 text-indigo-400
                          group-hover:bg-indigo-500/25 transition
                        "
                      >
                        <Users size={20} />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          Add Users in Bulk
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Upload CSV or invite multiple users at once
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <p className="mt-4 text-xs text-slate-400 text-center">
                  You can manage and resend invitations later from the user list
                </p>
              </div>
            </div>
          </div>
        )}

        {addSingleUserOpen && (
          <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 backdrop-blur-sm p-4 md:p-6 pt-20">
            {/* Small Panel */}
            <div className="w-full max-w-2xl rounded-xl border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] border-white/10 shadow-2xl animate-in slide-in-from-right-6 fade-in duration-200">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Add Users
                </h3>

                <button
                  onClick={() => {
                    setAddSingleUserOpen(false);
                  }}
                  className="text-[#9db5d6] hover:text-white transition"
                >
                  ✕
                </button>
              </div>
              {/* Body */}
              <form className="px-5 py-4 space-y-4">
                {/* Company User ID */}
                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    User ID (Internal) <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="companyUserId"
                    placeholder="e.g., EMP-1023"
                    className="
                    w-full rounded-lg bg-[rgba(15,23,42,0.6)]
                    border border-white/10 px-3 py-2 text-sm text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40
                    transition-all
                  "
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Identifier used internally within your organization
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    placeholder="e.g., Rahul Sharma"
                    className="
                    w-full rounded-lg bg-[rgba(15,23,42,0.6)]
                    border border-white/10 px-3 py-2 text-sm text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40
                    transition-all
                  "
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g., user@company.com"
                    className="
                      w-full rounded-lg bg-[rgba(15,23,42,0.6)]
                      border border-white/10 px-3 py-2 text-sm text-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      transition-all
                    "
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Invitation link will be sent to this email
                  </p>
                </div>

                {/* Role / Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      className="
                        w-full rounded-lg bg-[rgba(15,23,42,0.6)]
                        border border-white/10 px-3 py-2 text-sm text-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500/40
                        transition-all
                      "
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      className="
                      w-full rounded-lg bg-[rgba(15,23,42,0.6)]
                      border border-white/10 px-3 py-2 text-sm text-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      transition-all
                    "
                    >
                      <option value="Invited">Invited</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setAddSingleUserOpen(false);
                  }}
                  className="text-sm text-[#9db5d6] hover:text-white transition px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  className="
                    px-4 py-2 text-sm rounded-lg
                    bg-[#7fa4c4] hover:bg-[#6b8fb0]
                    text-white font-medium transition-all
                  "
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        {addMultipleUserOpen && (
          <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 backdrop-blur-sm p-4 md:p-6 pt-20">
            {/* Small Panel */}
            <div
              className="w-full max-w-2xl rounded-xl border border-[rgba(127,164,196,0.15)]
      bg-gradient-to-br from-[rgba(30,41,59,0.5)]
      via-[rgba(20,30,48,0.3)]
      to-[rgba(15,23,42,0.2)]
      border-white/10 shadow-2xl
      animate-in slide-in-from-right-6 fade-in duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Add Users in Bulk
                </h3>

                <button
                  onClick={() => {
                    setAddMultipleUserOpen(false);
                  }}
                  className="text-[#9db5d6] hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4 space-y-5">
                {/* Info Banner */}
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-xs text-blue-200">
                  Upload a CSV file to invite multiple users at once. Each user
                  will receive an invitation email.
                </div>

                {/* CSV Upload */}
                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    Upload CSV File <span className="text-red-400">*</span>
                  </label>

                  <div
                    className="
              flex flex-col items-center justify-center gap-2
              w-full rounded-lg border border-dashed border-white/20
              bg-[rgba(15,23,42,0.5)]
              px-4 py-6 text-center
              hover:border-[rgba(127,164,196,0.4)]
              transition
            "
                  >
                    <p className="text-sm text-slate-300">
                      Drag & drop CSV file here
                    </p>
                    <p className="text-xs text-slate-400">
                      or click to browse from your system
                    </p>

                    <button
                      type="button"
                      className="
                mt-2 px-3 py-1.5 text-xs rounded-md
                bg-[rgba(127,164,196,0.2)]
                text-white hover:bg-[rgba(127,164,196,0.3)]
                transition
              "
                    >
                      Browse File
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Supported format:{" "}
                    <code className="text-slate-300">.csv</code>
                  </p>
                </div>

                {/* CSV Format */}
                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    Expected CSV Columns
                  </label>

                  <div
                    className="
              rounded-lg bg-[rgba(15,23,42,0.6)]
              border border-white/10 p-3 text-xs
              text-slate-300 font-mono
            "
                  >
                    companyUserId, name, email, role
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    Role is optional. Defaults to{" "}
                    <span className="text-slate-300">User</span>.
                  </p>
                </div>

                {/* Defaults */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                      Default Role
                    </label>
                    <select
                      className="
                w-full rounded-lg bg-[rgba(15,23,42,0.6)]
                border border-white/10 px-3 py-2 text-sm text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                transition-all
              "
                    >
                      <option>User</option>
                      <option>Admin</option>
                      <option>Viewer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                      Invitation Status
                    </label>
                    <select
                      className="
                w-full rounded-lg bg-[rgba(15,23,42,0.6)]
                border border-white/10 px-3 py-2 text-sm text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                transition-all
              "
                    >
                      <option>Invited</option>
                      <option>Active</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setAddMultipleUserOpen(false);
                  }}
                  className="text-sm text-[#9db5d6] hover:text-white transition px-3 py-2"
                >
                  Cancel
                </button>

                <button
                  className="
            px-4 py-2 text-sm rounded-lg
            bg-[#7fa4c4] hover:bg-[#6b8fb0]
            text-white font-medium transition-all
          "
                >
                  Upload & Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
