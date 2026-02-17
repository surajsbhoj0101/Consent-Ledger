import React, { useState, useEffect } from "react";
import { Building2, Mail, Phone, MapPin, Globe } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import Loading from "../../components/loadingComponent";

function RegisterCompany() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    website: "",
    industry: "",
    description: "",
  });
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  const [notice, setNotice] = useState();
  const [redNotice, setRedNotice] = useState(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fields = [
    "companyName",
    "email",
    "phone",
    "address",
    "website",
    "industry",
    "description",
  ];
  const filledFields = fields.filter(
    (field) => formData[field].trim() !== "",
  ).length;
  const requiredFields = [
    "companyName",
    "email",
    "website",
    "industry",
    "website",
  ];
  const filledRequired = requiredFields.filter(
    (field) => formData[field].trim() !== "",
  ).length;
  const progressPercentage = Math.round((filledFields / fields.length) * 100);

  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const orbitronStyle = { fontFamily: "Orbitron, sans-serif" };

  const handleSubmitCompanyDetails = async () => {
    if (filledRequired != requiredFields.length) {
      setRedNotice(true);
      setNotice("Required fields missing");
      return;
    }

    const payload = {
      name: formData.companyName.trim(),
      email: formData.email.trim(),
      website: formData.website?.trim(),
      address: formData.address?.trim(),
      industry: formData.industry,
      description: formData.description?.trim(),
    };

    try {
      setIsLoading(true);
      setLoadingMessage("Saving company profile");
      const response = await axios.put(
        `http://localhost:5000/api/company/edit-company-details`,
        payload,
        { withCredentials: true },
      );

      if (!response.data?.success) {
        console.error("Update failed:", response.data.message);
        return;
      }
      setRedNotice(false);
      setNotice("Company details updated successfully");
      setTimeout(() => {
        navigate("/company/dashboard");
      }, 500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "API Error:",
          error.response?.data?.message || error.message,
        );
      } else {
        console.error("Unexpected error:", error);
      }
      setTimeout(() => {
        setRedNotice(true);
        setNotice("an error occured");
      }, 2000);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  async function checkIfAuthorized() {
    try {
      setIsLoading(true);
      setLoadingMessage("Checking authorization");
      const res = await axios.get("http://localhost:5000/api/auth/validate", {
        withCredentials: true,
      });

      if (!res.data.data) {
        navigate("/");
      }

      if (res.data.data?.role != "company") {
        setTimeout(() => {
          navigate("/");
        }, 2000);
        setRedNotice(true);
        setNotice("You are not Registered !!");
      }
    } catch (error) {
      console.log(error);

      setTimeout(() => {
        console.log("Nav");
        navigate("/");
      }, 2000);
      setRedNotice(true);
      setNotice("You are not Registered !!");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }

  async function checkIfAlreadyRegistered() {
    try {
      setIsLoading(true);
      setLoadingMessage("Loading company details");
      const res = await axios.get(
        "http://localhost:5000/api/company/check-registered",
        {
          withCredentials: true,
        },
      );

      if (res.data.isRegister) {
        navigate("/company/dashboard");
      }

      const existingEmail = res.data?.email?.trim();

      if (existingEmail) {
        setFormData((prev) => ({
          ...prev,
          email: existingEmail,
        }));
        setIsEmailLocked(true);
      }
      console.log(res.data.email);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }

  useEffect(() => {
    checkIfAuthorized();
    checkIfAlreadyRegistered();
  }, []);

  const removeNotice = () => {
    setNotice("");
    setRedNotice(false);
  };

  return (
    <div
      style={robotoStyle}
      className="relative min-h-screen overflow-hidden bg-panel py-12 px-4"
    >
      <Loading isLoading={isLoading} loadingMessage={loadingMessage} />
      <div className="absolute inset-0 bg-app-surface" />
      {notice && (
        <div className="fixed top-4 right-4 z-50">
          <div
            onClick={removeNotice}
            className={`
              px-4 py-2 rounded-lg shadow-lg cursor-pointer
              backdrop-blur-md transition-all text-white
              ${
                redNotice
                  ? "bg-red-500/20 border border-red-500/40 text-red-300"
                  : "bg-teal-400/20 border border-teal-400/40 text-teal-300"
              }
            `}
          >
            {notice}
          </div>
        </div>
      )}

      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute h-24 w-24 rounded-full bg-brand/25 blur-3xl" />
              <Building2
                size={100}
                strokeWidth={1.1}
                className="relative text-[#cfe3f3] drop-shadow-[0_0_14px_rgba(127,164,196,0.6)]"
              />
            </div>
          </div>

          <h1
            style={orbitronStyle}
            className="text-3xl md:text-4xl font-semibold text-white mb-2"
          >
            Company Details
          </h1>
          <p className="text-white/50 text-sm">
            Register your organization details to get started
          </p>
        </div>

        <div
          className="
            group relative rounded-2xl
            space-y-4
            bg-white/3 backdrop-blur-md p-8 md:p-10
            border border-brand/40
            hover:shadow-[0_0_0_1px_#7fa4c4,0_0_75px_rgba(127,164,196,0.35)]
            transition-all duration-500
          "
        >
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white/70">
                Form Completion
              </span>
              <span className="text-sm font-semibold text-brand">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 border border-brand/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-brand-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-2">
              {filledFields} of {fields.length} fields completed
              {filledRequired < requiredFields.length &&
                ` • ${requiredFields.length - filledRequired} required field(s) remaining`}
            </p>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Enter your company name"
              className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-brand/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-brand focus:outline-none
                  transition-all duration-300
                "
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address <span className="text-red-400">*</span>
              </label>
                <input
                  type="email"
                  name="email"
                  readOnly={isEmailLocked}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="company@example.com"
                  className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-brand/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-brand focus:outline-none
                    transition-all duration-300
                    ${isEmailLocked ? "opacity-80 cursor-not-allowed" : ""}
                  `}
                />
                {isEmailLocked && (
                  <p className="text-xs text-white/50 mt-2">
                    Email is linked to your login and cannot be edited here.
                  </p>
                )}
              </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-brand/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-brand focus:outline-none
                    transition-all duration-300
                  "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-brand/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-brand focus:outline-none
                  transition-all duration-300
                "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              <Globe size={16} className="inline mr-2" />
              Website <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
              placeholder="https://example.com"
              className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-brand/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-brand focus:outline-none
                  transition-all duration-300
                "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Industry <span className="text-red-400">*</span>
            </label>
            <select
              name="industry"
              value={formData.industry}
              required
              onChange={handleChange}
              className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-brand/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-brand focus:outline-none
                  transition-all duration-300
                "
            >
              <option value="" className=" bg-panel ">
                Select Industry
              </option>
              <option value="Technology" className="bg-panel ">
                Technology
              </option>
              <option value="Healthcare" className="bg-panel">
                Healthcare
              </option>
              <option value="Finance" className="bg-panel">
                Finance
              </option>
              <option value="Retail" className="bg-panel">
                Retail
              </option>
              <option value="Manufacturing" className="bg-panel">
                Manufacturing
              </option>
              <option value="Other" className="bg-panel">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Company Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief description of your company..."
              rows="4"
              className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-brand/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-brand focus:outline-none
                  transition-all duration-300
                  resize-none
                "
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitCompanyDetails}
            type="submit"
            disabled={filledRequired < requiredFields.length}
            className="
                w-full mt-8 py-3 px-6 rounded-xl
                bg-gradient-to-r from-brand/65 to-brand-3/65
                hover:from-brand hover:to-brand-3
                text-white font-medium text-sm
                shadow-lg transition-all duration-300
                hover:shadow-[0_0_30px_rgba(127,164,196,0.5)]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
          >
            {submitted ? "Details Saved!" : "Save Company Details"}
          </button>

          {submitted && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
              Company details have been saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterCompany;
