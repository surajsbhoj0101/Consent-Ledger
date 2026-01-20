import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building2, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react'

function RegisterUser() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profession: '',
    company: '',
    bio: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (formData.email && !formData.email.includes('@')) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.profession.trim()) newErrors.profession = 'Profession is required'
    if (!formData.company.trim()) newErrors.company = 'Company name is required'
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    console.log('Form Data:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'profession', 'company', 'bio']
  const filledFields = fields.filter(field => formData[field].trim() !== '').length
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'profession', 'company', 'bio']
  const filledRequired = requiredFields.filter(field => formData[field].trim() !== '').length
  const progressPercentage = Math.round((filledFields / fields.length) * 100)

  const isFieldValid = (fieldName) => formData[fieldName]?.trim() !== ''
  const isRequiredField = (fieldName) => requiredFields.includes(fieldName)

  const robotoStyle = { fontFamily: "Roboto, sans-serif" }
  const orbitronStyle = { fontFamily: "Orbitron, sans-serif" }

  return (
    <div style={robotoStyle} className='relative min-h-screen overflow-hidden bg-[#14171d] py-12 px-4'>
      <div className="absolute inset-0 bg-[#12151b]" />
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute h-24 w-24 rounded-full bg-[#a78bfa]/25 blur-3xl" />
              <User
                size={100}
                strokeWidth={1.1}
                className="relative text-[#e9d5ff] drop-shadow-[0_0_14px_rgba(167,139,250,0.6)]"
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
            border border-[#a78bfa]/40
            hover:shadow-[0_0_0_1px_#a78bfa,0_0_75px_rgba(167,139,250,0.35)]
            transition-all duration-500
          "
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-white/70">Profile Completion</span>
              <span className={`text-sm font-semibold transition-colors ${progressPercentage === 100 ? 'text-green-400' : 'text-[#a78bfa]'}`}>
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/10 border border-[#a78bfa]/20 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${progressPercentage === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6]'}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-2">
              {filledFields} of {fields.length} fields completed
              {filledRequired < requiredFields.length && ` • ${requiredFields.length - filledRequired} required field(s) remaining`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name and Last Name Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">
                    <User size={16} className="inline mr-2" />
                    First Name <span className="text-red-400">*</span>
                  </label>
                  {isFieldValid('firstName') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
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
                    ${errors.firstName ? 'border-red-500/50 focus:border-red-500' : 'border-[#a78bfa]/30 focus:border-[#a78bfa]'}
                    ${isFieldValid('firstName') && !errors.firstName ? 'border-green-500/50' : ''}
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
                  {isFieldValid('lastName') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
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
                    ${errors.lastName ? 'border-red-500/50 focus:border-red-500' : 'border-[#a78bfa]/30 focus:border-[#a78bfa]'}
                    ${isFieldValid('lastName') && !errors.lastName ? 'border-green-500/50' : ''}
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
                  {isFieldValid('email') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@example.com"
                  className={`
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border 
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:outline-none
                    transition-all duration-300
                    ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-[#a78bfa]/30 focus:border-[#a78bfa]'}
                    ${isFieldValid('email') && !errors.email ? 'border-green-500/50' : ''}
                  `}
                />
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
                  {isFieldValid('phone') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-[#a78bfa]/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-[#a78bfa] focus:outline-none
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
                {isFieldValid('address') && (
                  <CheckCircle2 size={16} className="text-green-400" />
                )}
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-[#a78bfa]/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#a78bfa] focus:outline-none
                  transition-all duration-300
                "
              />
            </div>

            {/* City and Country Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">City</label>
                  {isFieldValid('city') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
                </div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-[#a78bfa]/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-[#a78bfa] focus:outline-none
                    transition-all duration-300
                  "
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">Country</label>
                  {isFieldValid('country') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
                </div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-[#a78bfa]/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-[#a78bfa] focus:outline-none
                    transition-all duration-300
                  "
                />
              </div>
            </div>

            {/* Profession and Company Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">
                    <Briefcase size={16} className="inline mr-2" />
                    Profession
                  </label>
                  {isFieldValid('profession') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
                </div>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Your profession/title"
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-[#a78bfa]/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-[#a78bfa] focus:outline-none
                    transition-all duration-300
                  "
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/80">
                    <Building2 size={16} className="inline mr-2" />
                    Company
                  </label>
                  {isFieldValid('company') && (
                    <CheckCircle2 size={16} className="text-green-400" />
                  )}
                </div>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-[#a78bfa]/30
                    text-white placeholder-white/30
                    focus:bg-white/8 focus:border-[#a78bfa] focus:outline-none
                    transition-all duration-300
                  "
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/80">Bio</label>
                {isFieldValid('bio') && (
                  <CheckCircle2 size={16} className="text-green-400" />
                )}
              </div>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="4"
                className="
                  w-full px-4 py-3 rounded-lg
                  bg-white/5 border border-[#a78bfa]/30
                  text-white placeholder-white/30
                  focus:bg-white/8 focus:border-[#a78bfa] focus:outline-none
                  transition-all duration-300
                  resize-none
                "
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={filledRequired < requiredFields.length}
              className="
                w-full mt-8 py-3 px-6 rounded-xl
                bg-gradient-to-r from-[#a78bfa]/65 to-[#8b5cf6]/65
                hover:from-[#a78bfa] hover:to-[#8b5cf6]
                text-white font-medium text-sm
                shadow-lg transition-all duration-300
                hover:shadow-[0_0_30px_rgba(167,139,250,0.5)]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
              "
            >
              {submitted ? 'Profile Saved!' : `Save Profile ${filledRequired < requiredFields.length ? `(${requiredFields.length - filledRequired} required)` : ''}`}
            </button>
          </form>

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

export default RegisterUser
