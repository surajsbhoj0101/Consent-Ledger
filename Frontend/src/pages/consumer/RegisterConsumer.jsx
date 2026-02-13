import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { User, Mail, Phone, MapPin, Building2, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react'

function RegisterConsumer() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  })
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState()
  const [redNotice, setRedNotice] = useState(false);
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

  }

  const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'bio']
  const filledFields = fields.filter(field => formData[field].trim() !== '').length
  const requiredFields = ['firstName', 'lastName', 'email']
  const filledRequired = requiredFields.filter(field => formData[field].trim() !== '').length
  const progressPercentage = Math.round((filledFields / fields.length) * 100)

  

  const robotoStyle = { fontFamily: "Roboto, sans-serif" }
  const orbitronStyle = { fontFamily: "Orbitron, sans-serif" }

  const handleSubmitConsumerDetails = async () => {
    if (filledRequired != requiredFields.length) {
      setRedNotice(true);
      setNotice("Required fields missing")
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      website: formData.website?.trim(),
      phone: formData.phone,
      bio: formData.bio
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/consumer/edit-consumer-details`,
        payload,
        { withCredentials: true }
      );

      if (!response.data?.success) {
        console.error("Update failed:", response.data.message);
        return;
      }
      setSubmitted(true);
      setRedNotice(false);
      setNotice("Consumer details updated successfully");
      setTimeout(() => {
        navigate("/consumer/dashboard");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "API Error:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      setTimeout(() => {
        setRedNotice(true);
        setNotice("an error occured");

      }, 2000);
    }
  };

  async function checkIfAuthorized() {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/validate', {
        withCredentials: true
      })

      if (!res.data.data) {
        navigate('/')
      }

      if (res.data.data?.role != 'consumer') {
        setTimeout(() => {
          navigate('/')
        }, 2000);
        setRedNotice(true);
        setNotice("You are not Registered !!");
      }
    } catch (error) {
      console.log(error)

      setTimeout(() => {
        console.log("Nav")
        navigate('/')
      }, 2000);
      setRedNotice(true);
      setNotice("You are not Registered !!");

    }
  }

  async function checkIfAlreadyRegistered() {
    try {
      const res = await axios.get("http://localhost:5000/api/consumer/profile", {
        withCredentials: true,
      });

      const consumer = res.data?.consumer;
      if (!consumer) return;

      if (consumer.isRegistered) {
        navigate("/consumer/dashboard");
      }

      const existingEmail = consumer?.basicInformation?.email?.trim();
      if (existingEmail) {
        setFormData((prev) => ({
          ...prev,
          email: existingEmail,
        }));
        setIsEmailLocked(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfAuthorized()
    checkIfAlreadyRegistered()
  }, [])

  const removeNotice = () => {
    setNotice("")
    setRedNotice(false)
  }

  return (
    <div style={robotoStyle} className='relative min-h-screen overflow-hidden bg-[#14171d] py-12 px-4'>
      <div className="absolute inset-0 bg-[#12151b]" />

      {notice && (
        <div className="fixed top-4 right-4 z-50">
          <div
            onClick={removeNotice}
            className={`
              px-4 py-2 rounded-lg cursor-pointer
              backdrop-blur-md shadow-lg transition-all
              ${redNotice
                ? "bg-red-500/20 border border-red-400/40 text-red-300"
                : "bg-[#7fa4c4]/20 border border-[#7fa4c4]/40 text-[#b0c5db]"}
            `}
          >
            {notice}
          </div>
        </div>
      )}


      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.08),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.06),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute h-24 w-24 rounded-full bg-[#7fa4c4]/25 blur-3xl" />
              <User
                size={100}
                strokeWidth={1.1}
                className="relative text-[#e9d5ff] drop-shadow-[0_0_14px_rgba(127,164,196,0.6)]"
              />
            </div>
          </div>

          <h1 style={orbitronStyle} className="text-3xl md:text-4xl font-semibold text-white mb-2">
            User Profile
          </h1>
          <p className="text-white/50 text-sm">
            Complete your profile information to get started
          </p>
        </div>

        <div
          className="
            group relative rounded-2xl
            bg-white/3 backdrop-blur-md p-8 md:p-10
            border border-[#7fa4c4]/40
            hover:shadow-[0_0_0_1px_#7fa4c4,0_0_75px_rgba(127,164,196,0.35)]
            transition-all duration-500
          "
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-white/70">Profile Completion</span>
              <span className={`text-sm font-semibold transition-colors text-[#7fa4c4]`}>
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 border border-[#7fa4c4]/20 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full bg-gradient-to-r from-[#7fa4c4] to-[#6b8fb0]`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-2">
              {filledFields} of {fields.length} fields completed
              {filledRequired < requiredFields.length && ` • ${requiredFields.length - filledRequired} required field(s) remaining`}
            </p>
          </div>

          <div className='form flex flex-col space-y-3'>
            {/* First Name and Last Name Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">
                    <User size={16} className="inline mr-2" />
                    First Name <span className="text-red-400">*</span>
                  </label>

                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your first name"
                  className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border 
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:outline-none
                    transition-all duration-300
                    border-[#7fa4c4]/30 focus:border-[#7fa4c4]
                    
                  `}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">
                    Last Name <span className="text-red-400">*</span>
                  </label>

                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your last name"
                  className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border 
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:outline-none
                    transition-all duration-300
                 border-[#7fa4c4]/30 focus:border-[#7fa4c4]
                  `}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email and Phone Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">
                    <Mail size={16} className="inline mr-2" />
                    Email Address <span className="text-red-400">*</span>
                  </label>

                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly={isEmailLocked}
                  onChange={handleChange}
                  required
                  placeholder="your@example.com"
                  className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border 
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:outline-none
                    transition-all duration-300
                    border-[#7fa4c4]/30 focus:border-[#7fa4c4]
                    ${isEmailLocked ? "opacity-80 cursor-not-allowed" : ""}
                  `}
                />
                {isEmailLocked && (
                  <p className="text-xs text-white/50 mt-2">
                    Email is linked to your login and cannot be edited here.
                  </p>
                )}
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>

                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-[#7fa4c4]/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none
                    transition-all duration-300
                  "
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/80">
                  <MapPin size={16} className="inline mr-2" />
                  Address
                </label>

              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-[#7fa4c4]/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none
                  transition-all duration-300
                "
              />
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/80">Bio</label>

              </div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="4"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-[#7fa4c4]/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#7fa4c4] focus:outline-none
                  transition-all duration-300
                  resize-none
                "
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmitConsumerDetails}
              disabled={filledRequired < requiredFields.length}
              className="
                w-full mt-8 py-3 px-6 rounded-xl
                bg-gradient-to-r from-[#7fa4c4]/65 to-[#6b8fb0]/65
                hover:from-[#7fa4c4] hover:to-[#6b8fb0]
                text-white font-medium text-sm
                shadow-lg transition-all duration-300
                hover:shadow-[0_0_30px_rgba(127,164,196,0.5)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
              "
            >
              {submitted ? 'Details Saved!' : 'Save Profile'}
            </button>
          </div>

          {submitted && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Your profile has been saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterConsumer
