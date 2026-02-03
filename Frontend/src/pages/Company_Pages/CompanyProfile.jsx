import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Wallet from "../../components/WalletComponent";
import NoticeBar from "../../components/NoticeBar";
import Loading from "../../components/loadingComponent";
import axios from "axios";
import {
  Building2,
  Mail,
  Globe,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Camera,
  ShieldCheck,
} from "lucide-react";
import "../../index.css";

function CompanyProfile() {
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [role, setRole] = useState();
  const [notice, setNotice] = useState("");
  const [redNotice, setRedNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    phone: "",
    address: "",
    industry: "",
    description: "",
    profileUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");

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

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage("Loading profile");
      const res = await axios.get("http://localhost:5000/api/company/profile", {
        withCredentials: true,
      });

      if (!res.data?.success) {
        setRedNotice(true);
        setNotice(res.data?.message || "Failed to load profile");
        return;
      }

      const info = res.data?.company?.basicInformation || {};
      setFormData({
        name: info?.name || "",
        email: info?.email || "",
        website: info?.website || "",
        phone: info?.phone || "",
        address: info?.address || "",
        industry: info?.industry || "",
        description: info?.description || "",
        profileUrl: res.data?.company?.profileUrl || "",
      });
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message || "Server error while loading profile",
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    getUser();
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      setIsUploading(true);
      setIsLoading(true);
      setLoadingMessage("Uploading image");

      const res = await axios.post(
        "http://localhost:5000/api/company/profile-image",
        form,
        { withCredentials: true },
      );

      if (!res.data?.success) {
        setRedNotice(true);
        setNotice(res.data?.message || "Failed to upload image");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profileUrl: res.data.profileUrl,
      }));
      setRedNotice(false);
      setNotice("Profile image updated");
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message || "Server error while uploading image",
      );
    } finally {
      setIsUploading(false);
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const completionFields = [
    formData.name,
    formData.email,
    formData.website,
    formData.phone,
    formData.address,
    formData.industry,
    formData.description,
    formData.profileUrl,
  ];
  const completedCount = completionFields.filter((field) => field?.trim?.())
    .length;
  const completionPercent = Math.round(
    (completedCount / completionFields.length) * 100,
  );

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage("Saving profile");

      const payload = {
        name: formData.name?.trim(),
        website: formData.website?.trim(),
        phone: formData.phone?.trim(),
        address: formData.address?.trim(),
        industry: formData.industry?.trim(),
        description: formData.description?.trim(),
      };

      const res = await axios.put(
        "http://localhost:5000/api/company/edit-company-details",
        payload,
        { withCredentials: true },
      );

      if (!res.data?.success) {
        setRedNotice(true);
        setNotice(res.data?.message || "Failed to update profile");
        return;
      }

      setRedNotice(false);
      setNotice("Profile updated successfully");
    } catch (error) {
      setRedNotice(true);
      setNotice(
        error?.response?.data?.message || "Server error while updating profile",
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div
      style={robotoStyle}
      className="relative h-screen overflow-y-auto custom-scrollbar bg-[#14171d]"
    >
      <div className="absolute inset-0 bg-[#12151b]" />
      <NoticeBar notice={notice} redNotice={redNotice} onClick={setNotice} />
      <Loading isLoading={isLoading} loadingMessage={loadingMessage} />

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
                    Company Profile
                  </h1>
                  <p className="text-[#9db5d6] text-xs md:text-sm mt-1">
                    Keep your organization details up to date
                  </p>
                </div>
                <div className="z-50 md:block">
                  <Wallet />
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 mt-6 mx-4 rounded-lg border border-[rgba(127,164,196,0.15)] bg-gradient-to-br from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.3)] to-[rgba(15,23,42,0.2)] backdrop-blur-md hover:border-[rgba(127,164,196,0.3)] transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-2xl tracking-tight">
                    Profile Details
                  </h2>
                  <p className="text-[#9db5d6] text-sm mt-1">
                    Email cannot be edited once set
                  </p>
                </div>
              </div>

              <div className="mb-8 rounded-xl border border-[rgba(127,164,196,0.15)] bg-[rgba(15,23,42,0.4)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-[#9db5d6]">
                    <ShieldCheck size={16} className="text-[#7fa4c4]" />
                    <span>Profile completion</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {completionPercent}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[rgba(127,164,196,0.15)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7fa4c4] to-[#6b8fb0] transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <p className="text-xs text-[#9db5d6] mt-2">
                  Complete your profile to improve trust and visibility.
                </p>
              </div>

              <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className="relative h-24 w-24 rounded-2xl border border-[rgba(127,164,196,0.2)] bg-[rgba(15,23,42,0.5)] overflow-hidden shadow-lg">
                  {formData.profileUrl ? (
                    <img
                      src={`http://localhost:5000${formData.profileUrl}`}
                      alt="Company profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#7fa4c4] text-2xl font-bold">
                      {formData.name?.[0]?.toUpperCase() || "C"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">
                    Profile Image
                  </p>
                  <p className="text-xs text-[#9db5d6] mt-1">
                    Upload a square image for best results.
                  </p>
                  <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(127,164,196,0.2)] bg-[rgba(15,23,42,0.5)] text-sm text-[#b0c5db] hover:text-white hover:border-[rgba(127,164,196,0.4)] transition cursor-pointer">
                    <Camera size={16} className="text-[#7fa4c4]" />
                    {isUploading ? "Uploading..." : "Add profile image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e.target.files?.[0])
                      }
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#7fa4c4] font-semibold flex items-center gap-2">
                      <Building2 size={14} /> Company Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Company name"
                      className="mt-1 w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#7fa4c4] font-semibold flex items-center gap-2">
                      <Mail size={14} /> Email
                    </label>
                    <div className="mt-1 flex flex-col md:flex-row gap-3">
                      <input
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-lg bg-white/5 border border-[#7fa4c4]/20 px-4 py-3 text-sm text-white/60 cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setOtpOpen(true)}
                        className="inline-flex items-center justify-center px-4 py-3 rounded-lg border border-[#7fa4c4]/40 text-sm text-white bg-gradient-to-r from-[#7fa4c4]/70 to-[#6b8fb0]/70 hover:from-[#7fa4c4] hover:to-[#6b8fb0] transition-all whitespace-nowrap"
                      >
                        Verify Email
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#7fa4c4] font-semibold flex items-center gap-2">
                      <Globe size={14} /> Website
                    </label>
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourcompany.com"
                      className="mt-1 w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#7fa4c4] font-semibold flex items-center gap-2">
                      <Phone size={14} /> Phone
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1 w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#7fa4c4] font-semibold flex items-center gap-2">
                      <MapPin size={14} /> Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Market Street, City"
                      className="mt-1 w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#7fa4c4] font-semibold flex items-center gap-2">
                      <Briefcase size={14} /> Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300"
                    >
                      <option value="" className="bg-[#282d36]">
                        Select industry
                      </option>
                      <option value="technology" className="bg-[#282d36]">
                        Technology
                      </option>
                      <option value="finance" className="bg-[#282d36]">
                        Finance
                      </option>
                      <option value="retail" className="bg-[#282d36]">
                        Retail
                      </option>
                      <option value="manufacturing" className="bg-[#282d36]">
                        Manufacturing
                      </option>
                      <option value="healthcare" className="bg-[#282d36]">
                        Healthcare
                      </option>
                      <option value="other" className="bg-[#282d36]">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#7fa4c4] font-semibold flex items-center gap-2">
                      <FileText size={14} /> Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell users about your company"
                      className="mt-1 w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#7fa4c4] to-[#6b8fb0] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[rgba(127,164,196,0.3)] transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {otpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(127,164,196,0.25)] bg-gradient-to-br from-[rgba(30,41,59,0.75)] via-[rgba(20,30,48,0.55)] to-[rgba(15,23,42,0.35)] shadow-[0_20px_60px_rgba(10,14,24,0.7)] backdrop-blur-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Verify Email
              </h3>
              <button
                onClick={() => {
                  setOtpOpen(false);
                  setOtp("");
                }}
                className="text-[#9db5d6] hover:text-white transition"
              >
                ✕
              </button>
            </div>
            <div className="px-5 py-5 space-y-4">
              <p className="text-sm text-[#9db5d6]">
                Enter the 6-digit OTP sent to your email address.
              </p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter OTP"
                className="w-full rounded-lg bg-white/5 border border-[#7fa4c4]/30 px-4 py-3 text-sm text-white placeholder-white/30 focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none transition-all duration-300 text-center tracking-[0.35em]"
              />
              <div className="flex items-center justify-between text-xs text-[#9db5d6]">
                <span>Didn’t receive it?</span>
                <button
                  type="button"
                  className="text-[#7fa4c4] hover:text-white transition"
                >
                  Resend OTP
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/10">
              <button
                onClick={() => {
                  setOtpOpen(false);
                  setOtp("");
                }}
                className="text-sm text-[#9db5d6] hover:text-white transition px-3 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#7fa4c4] to-[#6b8fb0] text-white font-medium hover:shadow-[0_0_25px_rgba(127,164,196,0.6)] transition-all"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyProfile;
