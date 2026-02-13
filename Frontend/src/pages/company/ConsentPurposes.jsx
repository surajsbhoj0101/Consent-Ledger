import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import Wallet from "../../components/WalletComponent";
import UseSearchFilter from "../../components/useSearchFilter.jsx";
import NoticeBar from "../../components/NoticeBar";
import Loading from "../../components/loadingComponent";
import {
  AlertCircle,
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPurposeId, setEditingPurposeId] = useState(null);

  const [notice, setNotice] = useState("");
  const [redNotice, setRedNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const API_BASE = "http://localhost:5000";
  const [searchData, setSearchData] = useState({
    search: "",
    sortBy: "",
    sortOrder: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    consentType: "Required",
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
      consentType: "Required",
      duration: "12 months",
      status: "Active",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (isEditMode && editingPurposeId) {
        const res = await axios.put(
          `${API_BASE}/api/company/consent-purposes`,
          { purposeId: editingPurposeId, updates: formData },
          { withCredentials: true }
        );

        if (res.data?.success) {
          const updated = res.data.purpose;
          setAllPurposes((prev) =>
            prev.map((p) => (p.id === updated._id ? mapPurpose(updated) : p))
          );
          setRedNotice(false);
          setNotice("Purpose updated successfully");
          closeModal();
          return;
        }

        setRedNotice(true);
        setNotice(res.data?.message || "Failed to update purpose");
        return;
      }

      const res = await axios.post(
        `${API_BASE}/api/company/consent-purposes`,
        formData,
        { withCredentials: true }
      );

      if (res.data?.success) {
        const created = res.data.purpose;
        setAllPurposes((prev) => [mapPurpose(created), ...prev]);
        setRedNotice(false);
        setNotice("Purpose created successfully");
        closeModal();
        return;
      }

      setRedNotice(true);
      setNotice(res.data?.message || "Failed to create purpose");
    } catch (err) {
      setRedNotice(true);
      setNotice(
        err?.response?.data?.message || "Server error while saving purpose"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [allPurposes, setAllPurposes] = useState([]);
  const [purposes, setPurposes] = useState([]);

  const getUser = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/validate`, {
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

  function mapPurpose(purpose) {
    return {
      id: purpose._id,
      name: purpose.name,
      description: purpose.description,
      consentType: purpose.consentType,
      duration: purpose.duration,
      status: purpose.status,
      createdAt: purpose.createdAt,
    };
  }

  function filterData(data) {
    let result = [...allPurposes];

    if (data.search?.trim()) {
      const q = data.search.toLowerCase();
      result = result.filter((pu) => pu.name.toLowerCase().includes(q));
    }

    const sortValue = data.sortBy?.toLowerCase();
    if (sortValue?.includes("name")) {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue?.includes("time")) {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setPurposes(result);
  }

  const fetchPurposes = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage("Loading purposes");
      const res = await axios.get(`${API_BASE}/api/company/consent-purposes`, {
        withCredentials: true,
      });

      if (!res.data?.success) {
        setRedNotice(true);
        setNotice(res.data?.message || "Failed to fetch purposes");
        return;
      }

      const payload = (res.data.purposes || []).map(mapPurpose);
      setAllPurposes(payload);
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message ||
          "Server error while fetching purposes"
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleEditPurpose = (purpose) => {
    if (!purpose) return;

    setFormData({
      name: purpose.name || "",
      description: purpose.description || "",
      consentType: purpose.consentType || "Required",
      duration: purpose.duration || "12 months",
      status: purpose.status || "Active",
    });
    setEditingPurposeId(purpose.id);
    setIsEditMode(true);
    setCreatePurposeOpen(true);
  };

  const handleDeletePurpose = async (purpose) => {
    if (!purpose) return;
    try {
      setIsLoading(true);
      setLoadingMessage("Deleting purpose");
      const res = await axios.delete(
        `${API_BASE}/api/company/consent-purposes`,
        {
          data: { purposeId: purpose.id },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        setAllPurposes((prev) => prev.filter((p) => p.id !== purpose.id));
        setRedNotice(false);
        setNotice("Purpose deleted successfully");
        return;
      }

      setRedNotice(true);
      setNotice(res.data?.message || "Failed to delete purpose");
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message ||
          "Server error while deleting purpose"
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const closeModal = () => {
    setCreatePurposeOpen(false);
    setIsEditMode(false);
    setEditingPurposeId(null);
    handleReset();
  };

  useEffect(() => {
    getUser();
    fetchPurposes();
  }, []);

  useEffect(() => {
    filterData(searchData);
  }, [searchData, allPurposes]);

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
            <div className="p-4 mt-6 mx-4 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] backdrop-blur-xl hover:border-[#7fa4c4]/60 transition-all duration-300 shadow-[0_18px_50px_rgba(10,14,24,0.5)]">
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
                  onClick={() => {
                    if (createPurposeOpen) {
                      closeModal();
                      return;
                    }
                    handleReset();
                    setCreatePurposeOpen(true);
                  }}
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
                <UseSearchFilter
                  value={searchData}
                  onChange={setSearchData}
                  total={purposes.length}
                />
              </div>

              {/* table based section */}
              <div className="rounded-2xl mt-3 overflow-x-scroll custom-scrollbar border border-[rgba(127,164,196,0.2)] bg-[rgba(10,16,28,0.35)] shadow-[0_12px_40px_rgba(10,14,24,0.45)]">
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
                                purpose.consentType === "Required"
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
                              <button
                                onClick={() => handleEditPurpose(purpose)}
                                className="p-2 hover:bg-[rgba(127,164,196,0.2)] rounded-lg transition-colors text-[#7fa4c4]"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeletePurpose(purpose)}
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
            <div className="w-full max-w-2xl rounded-2xl border border-[rgba(127,164,196,0.2)] bg-gradient-to-br from-[rgba(30,41,59,0.65)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.25)] border-white/10 shadow-[0_20px_60px_rgba(10,14,24,0.55)] animate-in slide-in-from-right-6 fade-in duration-200 backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  {isEditMode ? "Edit Purpose" : "Create Purpose"}
                </h3>

                <button
                  onClick={() => {
                    closeModal();
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
                    className={`w-full rounded-lg bg-white/5 border ${errors.name ? "border-red-500" : "border-[#7fa4c4]/30"} px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300`}
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
                    className={`w-full rounded-lg bg-white/5 border ${errors.description ? "border-red-500" : "border-[#7fa4c4]/30"} px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300 resize-none`}
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
                      className="w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    >
                      <option value="Required" className="bg-[#282d36]">
                        Required
                      </option>
                      <option value="Optional" className="bg-[#282d36]">
                        Optional
                      </option>
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
                      className="w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    >
                      <option value="1 month" className="bg-[#282d36]">
                        1 month
                      </option>
                      <option value="3 months" className="bg-[#282d36]">
                        3 months
                      </option>
                      <option value="6 months" className="bg-[#282d36]">
                        6 months
                      </option>
                      <option value="12 months" className="bg-[#282d36]">
                        12 months
                      </option>
                      <option value="Indefinite" className="bg-[#282d36]">
                        Indefinite
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                  <div>
                    <label className="text-xs font-semibold text-[#7fa4c4] block mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    >
                      <option value="Active" className="bg-[#282d36]">
                        Active
                      </option>
                      <option value="Inactive" className="bg-[#282d36]">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-white/10">
                <button
                  onClick={() => {
                    closeModal();
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
                  {isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Creating..."
                    : isEditMode
                      ? "Save"
                      : "Create"}
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
