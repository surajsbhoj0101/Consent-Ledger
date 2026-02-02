import React, { act, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Wallet from "../../components/WalletComponent";
import UseSearchFilter from "../../components/useSearchFilter.jsx";
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

function ConsentPurposes() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
  const [createPurposeOpen, setCreatePurposeOpen] = useState(false);
  const [searchData, setSearchData] = useState({
    search: "",
    sortBy: "",
    sortOrder: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    consentType: "Explicit",
    duration: "12 months",
    status: "Active",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || !formData.name.trim())
      newErrors.name = "Purpose name is required";
    if (!formData.description || !formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.description && formData.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      consentType: "Explicit",
      duration: "12 months",
      status: "Active",
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const newPurpose = { id: Date.now(), ...formData };
      setPurposes((prev) => [newPurpose, ...prev]);
      handleReset();
      setCreatePurposeOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("sidebarOpen") !== "false",
  );

  const [purposes, setPurposes] = useState([
    {
      id: 1,
      name: "Marketing Analytics",
      description: "Track user behavior for marketing purposes",
      consentType: "Explicit",
      duration: "12 months",
      status: "Active",
    },
    {
      id: 2,
      name: "Personalization",
      description: "Improve user experience with personalized content",
      consentType: "Implicit",
      duration: "6 months",
      status: "Active",
    },
    {
      id: 3,
      name: "Third-party Sharing",
      description: "Share anonymized data with partners",
      consentType: "Required",
      duration: "3 months",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Marketing Analytics",
      description: "Track user behavior for marketing purposes",
      consentType: "Optional",
      duration: "12 months",
      status: "Active",
    },
    {
      id: 5,
      name: "Personalization",
      description: "Improve user experience with personalized content",
      consentType: "Implicit",
      duration: "6 months",
      status: "Active",
    },
    {
      id: 6,
      name: "Third-party Sharing",
      description: "Share anonymized data with partners",
      consentType: "Explicit",
      duration: "3 months",
      status: "Inactive",
    },
    {
      id: 1,
      name: "Marketing Analytics",
      description: "Track user behavior for marketing purposes",
      consentType: "Explicit",
      duration: "12 months",
      status: "Active",
    },
    {
      id: 2,
      name: "Personalization",
      description: "Improve user experience with personalized content",
      consentType: "Implicit",
      duration: "6 months",
      status: "Active",
    },
    {
      id: 3,
      name: "Third-party Sharing",
      description: "Share anonymized data with partners",
      consentType: "Required",
      duration: "3 months",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Marketing Analytics",
      description: "Track user behavior for marketing purposes",
      consentType: "Optional",
      duration: "12 months",
      status: "Active",
    },
    {
      id: 5,
      name: "Personalization",
      description: "Improve user experience with personalized content",
      consentType: "Implicit",
      duration: "6 months",
      status: "Active",
    },
    {
      id: 6,
      name: "Third-party Sharing",
      description: "Share anonymized data with partners",
      consentType: "Explicit",
      duration: "3 months",
      status: "Inactive",
    },
  ]);

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

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

  function filterData(searchData) {
    let result = [...purposes];
    console.log(searchData)
    if (searchData.search?.trim()) {
      const q = searchData.search.toLowerCase();

      result = result.filter((pu) => pu.name.toLowerCase().includes(q));
    }

   
    if (searchData.sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (searchData.sort === "time") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setPurposes(result);
  }

  useEffect(() => {
    filterData(searchData);
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
                    Purpose Managment
                  </h1>
                  <p className="text-[#9db5d6] text-xs md:text-sm mt-1">
                    Define how and why user data is accessed
                  </p>
                </div>

                <div className=" z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            {/* table of purposes */}
            <div className="p-4 mt-6 mx-4 rounded-xl border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] backdrop-blur-md hover:border-[rgba(127,164,196,0.3)] transition-all duration-300 shadow-lg">
              {/* heading and button */}
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

              {/* Search filter component */}
              <div>
                <UseSearchFilter value={searchData} onChange={setSearchData} />
              </div>

              {/* table based section */}
              <div className="rounded-lg mt-3 overflow-x-scroll custom-scrollbar border border-[rgba(127,164,196,0.1)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-[rgba(127,164,196,0.1)] to-[rgba(127,164,196,0.05)] border-b border-[rgba(127,164,196,0.1)]">
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Purpose Name
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Consent Type
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#7fa4c4]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(127,164,196,0.1)]">
                    {purposes.length > 0 ? (
                      purposes.map((purpose) => (
                        <tr
                          key={purpose.id}
                          className="hover:bg-[rgba(127,164,196,0.08)] transition-colors duration-150 group"
                        >
                          <td className="px-6 py-4 text-white font-medium group-hover:text-[#7fa4c4] transition-colors">
                            {purpose.name}
                          </td>
                          <td className="px-6 py-4 text-[#b0c5db] text-xs max-w-xs truncate">
                            {purpose.description}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                purpose.consentType === "Explicit"
                                  ? "bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300"
                                  : "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-300"
                              }`}
                            >
                              {purpose.consentType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#b0c5db]">
                            {purpose.duration}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                purpose.status === "Active"
                                  ? "bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-300"
                                  : "bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-300"
                              }`}
                            >
                              {purpose.status}
                            </span>
                          </td>
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
                        <td colSpan="6" className="px-6 py-36 mb-2 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={24} className="text-[#7fa4c4]" />
                            <p className="text-[#b0c5db]">
                              No purposes created yet
                            </p>
                            <p className="text-xs text-[#9db5d6]">
                              Click "Create Purpose" to add your first consent
                              purpose
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

        {/* Create purpose Form */}
        {createPurposeOpen && (
          <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 backdrop-blur-sm p-4 md:p-6 pt-20">
            {/* Small Panel */}
            <div className="w-full max-w-2xl rounded-xl border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] border-white/10 shadow-2xl animate-in slide-in-from-right-6 fade-in duration-200">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Create Purpose
                </h3>

                <button
                  onClick={() => {
                    setCreatePurposeOpen(false);
                    handleReset();
                  }}
                  className="text-[#9db5d6] hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    Purpose Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Marketing Analytics"
                    className={`w-full rounded-lg  bg-[rgba(15,23,42,0.6)] border ${errors.name ? "border-red-500" : "border-white/10"} px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what data will be collected and how it will be used..."
                    className={`w-full rounded-lg  bg-[rgba(15,23,42,0.6)] border ${errors.description ? "border-red-500" : "border-white/10"} px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all `}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                  <div>
                    <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                      Consent Type
                    </label>
                    <select
                      name="consentType"
                      value={formData.consentType}
                      onChange={handleInputChange}
                      className="w-full rounded-lg  bg-[rgba(15,23,42,0.6)] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                    >
                      <option value="Required">Required</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full rounded-lg  bg-[rgba(15,23,42,0.6)] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                    >
                      <option value="1 month">1 month</option>
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                      <option value="Indefinite">Indefinite</option>
                    </select>
                  </div>
                  
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setCreatePurposeOpen(false);
                    handleReset();
                  }}
                  className="text-sm text-[#9db5d6] hover:text-white transition px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm rounded-lg bg-[#7fa4c4] hover:bg-[#6b8fb0] text-white font-medium disabled:opacity-60 transition-all"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>

              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsentPurposes;
