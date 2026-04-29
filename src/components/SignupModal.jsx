import React, { useState } from 'react';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export default function SignupModal({ isOpen, onClose, onSignupSuccess }) {
  const [step, setStep] = useState('email'); // email, otp, signup, login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    full_name: '',
    phone: '',
    country: '',
    state: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate password and request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await base44.functions.invoke('signupWithOTP', {
        action: 'request-otp',
        email: formData.email,
      });
      
      setOtpSent(true);
      setOtpExpiry(new Date(res.data.expiresAt));
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and create account
  const handleVerifyOTPAndSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await base44.functions.invoke('signupWithOTP', {
        action: 'verify-otp',
        email: formData.email,
        otp: formData.otp,
        full_name: formData.full_name,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        password: formData.password,
      });
      
      const { jwt, user, cybrid_customer_id } = res.data;
      
      localStorage.setItem('auth_token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('cybrid_customer_id', cybrid_customer_id);
      
      onSignupSuccess({ ...user, jwt, cybrid_customer_id });
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await base44.functions.invoke('login', {
        email: formData.email,
        password: formData.password,
      });
      
      const { jwt, user, cybrid_customer_id } = res.data;
      
      localStorage.setItem('auth_token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('cybrid_customer_id', cybrid_customer_id);
      
      onSignupSuccess({ ...user, jwt, cybrid_customer_id });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modal = createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2 text-slate-900">
          {step === 'login' ? 'Sign In' : step === 'otp' ? 'Verify Email' : 'Create Account'}
        </h2>
        <p className="text-slate-600 mb-6">
          {step === 'login' ? 'Welcome back!' : step === 'otp' ? 'Enter the code sent to your email' : 'Get started with Taper Payer'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Signup Form Step */}
        {step === 'email' && (
          <form onSubmit={handleRequestOTP} className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <Input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white appearance-none text-slate-900 cursor-pointer disabled:bg-slate-100"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States of America</option>
                    <option value="DOM">Dominican Republic</option>
                    <option value="GHA">Ghana</option>
                    <option value="HTI">Haiti</option>
                    <option value="KEN">Kenya</option>
                    <option value="IND">India</option>
                    <option value="SEN">Senegal</option>
                    </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    disabled={loading || !formData.country}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white appearance-none text-slate-900 cursor-pointer disabled:bg-slate-100"
                  >
                    <option value="">Select State</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <Input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="user-agreement"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
              />
              <label htmlFor="user-agreement" className="text-sm text-slate-600 leading-snug">
                I agree to the{' '}
                <a
                  href="http://cybrid.app/user-agreement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  User Agreement
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTPAndSignup} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              Verification code sent to {formData.email}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">6-Digit Code</label>
              <Input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="000000"
                maxLength="6"
                inputMode="numeric"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Verify & Create Account'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* Login Step */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="mt-4 text-center space-y-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="block w-full text-slate-500 hover:text-blue-600 text-sm"
              >
                Forgot your password?
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>,
    document.body
  );

  return (
    <>
      {modal}
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </>
  );
}