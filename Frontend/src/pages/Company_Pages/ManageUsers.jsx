import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Wallet from "../../components/WalletComponent";
import UseSearchFilter from "../../components/useSearchFilter";
import {
  Users,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Eye,
  UserPlus,
  Plus,
  UploadCloud,
  FileSpreadsheet,
} from "lucide-react";
import "../../index.css";
import NoticeBar from "../../components/NoticeBar";
import Loading from "../../components/loadingComponent";

function ManageUsers() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();

  // Notice fields
  const [notice, setNotice] = useState("");
  const [redNotice, setRedNotice] = useState(false);

  //loading modal fields
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Modal States
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addSingleUserOpen, setAddSingleUserOpen] = useState(false);
  const [addMultipleUserOpen, setAddMultipleUserOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const fileInputRef = useRef(null);
  const [file, setFile] = useState();
  const [error, setError] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [searchData, setSearchData] = useState({
    search: "",
    sortBy: "",
    sortOrder: "",
  });

  const [userData, setUserData] = useState({
    companyUserId: "",
    name: "",
    email: "",
    role: "",
  });

  const [users, setUsers] = useState([]);
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchData.search?.trim()) {
      const q = searchData.search.toLowerCase();
      result = result.filter((user) =>
        [user.name, user.email, user.id, user.role, user.status]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q)),
      );
    }

    const sortValue = searchData.sortBy?.toLowerCase();
    if (sortValue?.includes("name")) {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortValue?.includes("time")) {
      result.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    return result;
  }, [users, searchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith(".csv")) {
      setRedNotice(true);
      setNotice("Only CSV allowed");
      e.target.value = "";
      return;
    }

    setRedNotice(false);
    setNotice("");
    setFile(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addSingleUser = async () => {
    if (
      !userData.email ||
      !userData.companyUserId ||
      !userData.name ||
      !userData.role
    ) {
      setRedNotice(true);
      setNotice("Provide all the required details");
      return;
    }

    const payload = {
      id: userData.companyUserId.trim(),
      name: userData.name.trim(),
      email: userData.email.trim(),
      role: userData.role.trim(),
    };

    try {
      setIsLoading(true);
      setLoadingMessage("adding User");
      const res = await axios.post(
        "http://localhost:5000/api/company/add-single-user",
        { payload },
        { withCredentials: true },
      );

      if (res.data.success) {
        setRedNotice(false);
        setNotice("User added successfully");
        const u = res.data.user;
        const newPayload = {
          id: u?.externalUserId,
          name: u?.name,
          email: u?.email,
          role: u?.role,
          status: u?.status,
          createdAt: u?.createdAt || new Date().toISOString(),
        };
        setUsers((prev) => [...prev, newPayload]);
        return;
      }

      setRedNotice(true);
      setNotice(res.data.message || "Something went wrong");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Server error";

      setRedNotice(true);

      if (status === 409) {
        setNotice("User already exists");
      } else if (status === 403) {
        setNotice("Unauthorized access");
      } else {
        setNotice(message);
      }
    } finally {
      setUserData({
        email: "",
        companyUserId: "",
        name: "",
        role: "",
      });
      setAddUserOpen(false);
      setAddSingleUserOpen(false);
      setIsLoading(false);
      setLoadingMessage("")
    }
  };

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

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/company/fetch-users",
        { withCredentials: true },
      );

      if (!res.data.success) {
        setRedNotice(true);
        setNotice(res.data.message || "Failed to fetch users");
        return;
      }

      const usr = res.data.users;
      const payload = usr.map((u) => ({
        id: u?.externalUserId,
        name: u?.name,
        email: u?.email,
        role: u?.role,
        status: u?.status,
        createdAt: u?.createdAt,
      }));

      setUsers(payload);
    } catch (error) {
      console.error("fetchUsers error:", error);
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message || "Server error while fetching users",
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemoveUser = async (user) => {
    if (!user) {
      setRedNotice(true);
      setNotice("This user cannot be deleted");
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage("Removing User");
      const res = await axios.delete(
        "http://localhost:5000/api/company/remove-user",
        {
          data: { user },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        setRedNotice(false);
        setNotice("User Removed successfully");
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
        return;
      }

      setRedNotice(true);
      setNotice(res.data.message || "Something went wrong");
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message || "Server error while removing user",
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("")
    }
  };

  const handleEditUser = (user) => {
    if (!user) return;

    setUserData({
      companyUserId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setEditingUserId(user.id);
    setIsEditMode(true);
    setAddSingleUserOpen(true);
  };

  const updateUser = async () => {
    if (!userData.name || !userData.email || !userData.role) {
      setRedNotice(true);
      setNotice("Provide all required details");
      return;
    }

    const payload = {
      id: editingUserId,
      name: userData.name.trim(),
      email: userData.email.trim(),
      role: userData.role.trim(),
    };

    try {
      setIsLoading(true);
      setLoadingMessage("Removing User");

      const res = await axios.put(
        "http://localhost:5000/api/company/update-user",
        { payload },
        { withCredentials: true },
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUserId ? { ...u, ...payload } : u)),
        );

        setNotice("User updated successfully");
        setRedNotice(false);
        setAddSingleUserOpen(false);
        setIsEditMode(false);
        setEditingUserId(null);
      }
    } catch (err) {
      setRedNotice(true);
      setNotice("Failed to update user");
    } finally {
      setIsLoading(false);
      setLoadingMessage("")
    }
  };

  const handleUploadToCloud = async () => {
    if (!file) {
      setRedNotice(true);
      setNotice("Please select a file before proceeding");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      setLoadingMessage("Uploading users...");

      const res = await axios.post(
        "http://localhost:5000/api/company/add-multiple-users",
        formData,
        {
          withCredentials: true,
        },
      );

      if (res.data?.success) {
        setRedNotice(false);
        setNotice(res.data.message || "Users added successfully");

        const newUsers = res.data.users.map((u) => ({
          id: u.externalUserId,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          createdAt: u?.createdAt || new Date().toISOString(),
        }));

        setUsers((prev) => [...prev, ...newUsers]);
        setFile(null);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Upload failed";

      setRedNotice(true);
      setNotice(message);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const closeModals = () => {
    setAddSingleUserOpen(false);
    setIsEditMode(false);
    setEditingUserId(null);
    setUserData({
      email: "",
      companyUserId: "",
      name: "",
      role: "",
    });
  };

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-y-auto custom-scrollbar bg-[#14171d]"
    >
      <div className="absolute inset-0 bg-[#12151b]" />
      <NoticeBar notice={notice} redNotice={redNotice} onClick={setNotice} />
      <Loading isLoading={isLoading} loadingMessage={loadingMessage} />
      {/* large muted blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative flex h-screen">
        <Sidebar role={role} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                <div className="z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-5 mt-6 mx-4 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl hover:border-[#7fa4c4]/60 transition-all duration-300 shadow-[0_18px_50px_rgba(10,14,24,0.5)]">
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
                <UseSearchFilter
                  value={searchData}
                  onChange={setSearchData}
                  total={filteredUsers.length}
                />
              </div>
              <div className="rounded-2xl mt-3 overflow-x-scroll custom-scrollbar border border-[rgba(127,164,196,0.2)] bg-[rgba(10,16,28,0.35)] shadow-[0_12px_40px_rgba(10,14,24,0.45)]">
                <table className="w-full text-sm">
                  {/* Header */}
                  <thead>
                    <tr className="bg-gradient-to-r from-[rgba(127,164,196,0.1)] to-[rgba(127,164,196,0.05)] border-b border-[rgba(127,164,196,0.1)]">
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        User
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        ID
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
                      <th className="px-6 py-4 text-center font-semibold text-[#7fa4c4]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody className="divide-y divide-[rgba(127,164,196,0.1)]">
                    {filteredUsers?.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-[rgba(127,164,196,0.08)] transition-colors duration-150 group"
                        >
                          {/* User */}
                          <td className="px-6 py-4">
                            <span className="block text-white font-medium group-hover:text-[#7fa4c4] transition-colors truncate">
                              {user.name}
                            </span>
                          </td>

                          {/* ID */}
                          <td
                            className="px-6 py-4 text-xs text-[#9db5d6] font-mono truncate cursor-pointer"
                            title="Click to copy"
                            onClick={() =>
                              navigator.clipboard.writeText(user.id)
                            }
                          >
                            {user.id}
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-[#b0c5db] text-xs truncate">
                            {user.email}
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center justify-center min-w-[72px] px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "admin"
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
                              className={`inline-flex items-center justify-center min-w-[72px] px-3 py-1 rounded-full text-xs font-semibold ${
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

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-[rgba(127,164,196,0.2)] rounded-lg transition-colors text-[#7fa4c4]">
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 hover:bg-[rgba(127,164,196,0.2)] rounded-lg transition-colors text-[#7fa4c4]"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleRemoveUser(user)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-36 text-center">
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
            <div className="w-full max-w-2xl rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] border-white/10 shadow-[0_20px_60px_rgba(10,14,24,0.55)] animate-in slide-in-from-right-6 fade-in duration-200 backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  {isEditMode ? "Edit User" : "Add Users"}
                </h3>
                <button
                  onClick={() => {
                    setAddUserOpen(false);
                  }}
                  className="text-[#9db5d6] hover:text-white transition"
                >
                  <X size={20} />
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
                  {isEditMode ? "Edit User" : "Add Users"}
                </h3>

                <button
                  onClick={closeModals}
                  className="text-[#9db5d6] hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              {/* Body */}
              <div className="px-5 py-4 space-y-4">
                {/* Company User ID */}
                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    User ID (Internal) <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="companyUserId"
                    placeholder="e.g.. EMP-1004"
                    value={userData.companyUserId}
                    onChange={handleInputChange}
                    disabled={isEditMode}
                    className={`
                      w-full rounded-lg px-4 py-3 text-sm
                      border border-[#7fa4c4]/30
                      ${
                        isEditMode
                          ? "bg-white/5 text-slate-400 cursor-not-allowed"
                          : "bg-white/5 text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4]"
                      }
                      focus:outline-none transition-all duration-300
                    `}
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
                    value={userData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Rahul Sharma"
                    className="
                    w-full rounded-lg bg-white/5
                    border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30
                    focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none
                    transition-all duration-300
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
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., user@company.com"
                    className="
                      w-full rounded-lg bg-white/5
                      border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30
                      focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none
                      transition-all duration-300
                    "
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Invitation link will be sent to this email
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    Role <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                    placeholder="e.g., viewer, user"
                    className="
                      w-full rounded-lg bg-white/5
                      border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30
                      focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none
                      transition-all duration-300
                    "
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/10">
                <button
                  onClick={closeModals}
                  className="text-sm text-[#9db5d6] hover:text-white transition px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditMode ? updateUser : addSingleUser}
                  className="
                    px-4 py-2 text-sm rounded-lg
                    bg-[#7fa4c4] hover:bg-[#6b8fb0]
                    text-white font-medium transition-all
                  "
                >
                  {isEditMode ? "Update User" : "Add User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {addMultipleUserOpen && (
          <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 backdrop-blur-sm p-4 md:p-6 pt-20">
            {/* Small Panel */}
            <div
              className="w-full max-w-2xl rounded-2xl border border-[rgba(127,164,196,0.2)]
                bg-gradient-to-br from-[rgba(30,41,59,0.65)]
                via-[rgba(20,30,48,0.4)]
                to-[rgba(15,23,42,0.25)]
                border-white/10 shadow-[0_20px_60px_rgba(10,14,24,0.55)]
                animate-in slide-in-from-right-6 fade-in duration-200 backdrop-blur-xl"
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
                  <X size={20} />
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

                  {/* Hidden Input (Always present so it works) */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {file ? (
                    <div
                      className="
                      flex items-center justify-between
                      w-full rounded-xl border border-[rgba(127,164,196,0.35)]
                      bg-[rgba(127,164,196,0.08)]
                      p-3 transition-all animate-in fade-in zoom-in-95 duration-200
                    "
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 rounded-md bg-green-500/10 text-green-400">
                          <FileSpreadsheet size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleRemoveFile}
                        className="
                      p-2 rounded-lg text-slate-400
                      hover:text-white hover:bg-red-500/20 hover:text-red-400
                      transition-colors
                    "
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="
                        flex flex-col items-center justify-center gap-2
                        w-full rounded-xl border border-dashed border-[rgba(127,164,196,0.35)]
                        bg-[rgba(15,23,42,0.6)]
                        px-4 py-6 text-center
                        hover:border-[#7fa4c4]/70
                        hover:bg-[rgba(15,23,42,0.75)]
                        transition cursor-pointer group
                      "
                      onClick={handleButtonClick}
                    >
                      <div className="p-3 rounded-full bg-white/5 group-hover:bg-[#7fa4c4]/10 transition mb-1">
                        <UploadCloud size={24} className="text-[#7fa4c4]" />
                      </div>

                      <p className="text-sm text-slate-300">
                        Drag & drop CSV file here
                      </p>
                      <p className="text-xs text-slate-400">
                        or click to browse
                      </p>

                      <button
                        type="button"
                        // onClick is handled by the parent div wrapper for better UX,
                        // but kept here just in case you remove the parent onClick
                        onClick={(e) => {
                          e.stopPropagation();
                          handleButtonClick();
                        }}
                        className="
                        mt-2 px-3 py-1.5 text-xs rounded-md
                        bg-[rgba(127,164,196,0.1)] border border-[rgba(127,164,196,0.2)]
                        text-[#9db5d6] group-hover:bg-[#7fa4c4] group-hover:text-white
                        transition-all duration-300
                      "
                      >
                        Browse File
                      </button>
                    </div>
                  )}
                </div>
                <div>
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
                  onClick={handleUploadToCloud}
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
