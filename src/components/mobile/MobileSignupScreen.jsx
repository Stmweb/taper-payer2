import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';
import CountryDrawer from '@/components/mobile/CountryDrawer';

const STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming'
];

const InputField = ({ icon: Icon, type = 'text', placeholder, value, onChange, required }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      <Icon className="w-4 h-4" />
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full pl-11 pr-4 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
      style={{ fontSize: '16px' }}
    />
  </div>
);

export default function MobileSignupScreen() {
  const { login } = useAppAuth();
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '',
    email: '', country: 'United States', state: '',
    referralCode: '', mobile: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showStateDrawer, setShowStateDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('Please agree to the User Agreement.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await base44.functions.invoke('signup', {
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName}${formData.middleName ? ' ' + formData.middleName : ''} ${formData.lastName}`.trim(),
        phone: formData.mobile,
        country: formData.country,
        state: formData.state,
        referral_code: formData.referralCode,
      });
      const { jwt, user, cybrid_customer_id } = res.data;
      login(user, jwt, cybrid_customer_id);
      setSuccess(true);
      setTimeout(() => { window.location.href = '/TaperPayerHome'; }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header bar */}
      <div className="bg-gray-100 px-4 pt-3 pb-1 flex items-center gap-2">
        <Link to="/TaperPayerLogin" className="text-gray-600 min-h-0 min-w-0 p-0">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <p className="text-sm font-medium text-gray-800">Create Account</p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white mx-3 rounded-2xl shadow-sm px-6 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col items-center"
        >
          {/* Logo */}
          <img
            src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png"
            alt="Taper Payer"
            className="h-40 w-auto mb-6 mix-blend-multiply"
          />

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account 🎉</h1>
          <p className="text-sm text-gray-500 mb-7">Register for free and start sending money home</p>

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            {/* First Name */}
            <InputField icon={User} placeholder="First Name" value={formData.firstName} onChange={set('firstName')} required />

            {/* Middle Name */}
            <InputField icon={User} placeholder="Middle Name (optional)" value={formData.middleName} onChange={set('middleName')} />

            {/* Last Name */}
            <InputField icon={User} placeholder="Last Name" value={formData.lastName} onChange={set('lastName')} required />

            {/* Email */}
            <InputField icon={Mail} type="email" placeholder="Email" value={formData.email} onChange={set('email')} required />

            {/* Country */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={formData.country}
                onChange={set('country')}
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 appearance-none focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                style={{ fontSize: '16px' }}
              >
                <option value="United States">United States of America</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ghana">Ghana</option>
                <option value="Haiti">Haiti</option>
                <option value="Kenya">Kenya</option>
                <option value="India">India</option>
                <option value="Senegal">Senegal</option>
              </select>
            </div>

            {/* State */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => setShowStateDrawer(true)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-left flex items-center justify-between focus:outline-none"
                style={{ fontSize: '16px' }}
              >
                <span className={formData.state ? 'text-gray-800' : 'text-gray-400'}>{formData.state || 'Select State'}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <CountryDrawer
              open={showStateDrawer}
              onOpenChange={setShowStateDrawer}
              countries={STATES}
              value={formData.state}
              onSelect={(state) => setFormData(prev => ({ ...prev, state }))}
              title="Select State"
            />

            {/* Mobile */}
            <InputField icon={Phone} type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={set('mobile')} required />

            {/* Referral Code */}
            <InputField icon={User} placeholder="Referral Code (optional)" value={formData.referralCode} onChange={set('referralCode')} />

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={set('password')}
                placeholder="Password"
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                style={{ fontSize: '16px' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 min-h-0 min-w-0 p-0">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Confirm Password"
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                style={{ fontSize: '16px' }}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 min-h-0 min-w-0 p-0">
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password requirements */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-2xl px-4 py-3">
              <p className="font-semibold mb-1 text-gray-600">Password must contain:</p>
              <ul className="space-y-0.5 ml-2">
                <li>• One number, one capital letter, one small letter</li>
                <li>• One special character</li>
                <li>• Min 8 characters, max 16 characters</li>
              </ul>
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3 pt-1">
              <div
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors ${agreedToTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}
              >
                {agreedToTerms && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <label className="text-sm text-gray-500 leading-tight cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                I agree to the{' '}
                <a
                  href="https://cdn.prod.website-files.com/691c3ed36cbe630ffe6844b3/696ea2d4c3253c82181f6aca_250505%20Cybrid%20User%20Agreement.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  User Agreement
                </a>
              </label>
            </div>

            {/* Error / Success */}
            {errorMsg && (
              <div className="text-sm text-red-600 text-center bg-red-50 rounded-xl px-4 py-2">
                {errorMsg}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600 text-center bg-green-50 rounded-xl px-4 py-2">
                ✓ Account created! Redirecting…
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full text-white font-semibold text-base disabled:opacity-70 transition-opacity mt-2"
              style={{ backgroundColor: '#1a6fc4', fontSize: '16px' }}
            >
              {isSubmitting ? 'Creating Account…' : 'Register'}
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500 pt-1">
              Already have an account?{' '}
              <Link to="/TaperPayerLogin" className="text-orange-500 font-semibold hover:text-orange-600">
                Log In
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
      <div className="h-4" />
    </div>
  );
}