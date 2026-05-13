import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

export default function MobileLoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAppAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await base44.functions.invoke('login', { email: identifier, password });
      const { jwt, user, cybrid_customer_id } = res.data;
      localStorage.setItem('auth_token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('cybrid_customer_id', cybrid_customer_id);
      login(user, jwt, cybrid_customer_id);
      const returnTo = new URLSearchParams(window.location.search).get('from') || '/TaperPayerHome';
      window.location.href = returnTo;
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Login failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="flex justify-center pt-6 pb-4">
        <img 
          src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png"
          alt="Taper Payer"
          className="h-40 w-auto"
        />
      </div>

      {/* Main card */}
      <div className="flex-1 bg-white mx-3 mb-6 rounded-2xl shadow-sm flex flex-col items-center px-6 pt-8 pb-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col items-center"
        >
          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Phone or Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Phone or Email"
                required
                className="w-full pl-11 pr-4 h-13 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                style={{ fontSize: '16px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 min-h-0 min-w-0 p-0"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right -mt-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-gray-500 hover:text-blue-600 min-h-0 p-0"
              >
                Forgot Password?
              </button>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="text-sm text-red-600 text-center bg-red-50 rounded-xl px-4 py-2">
                {errorMsg}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full text-white font-semibold text-base disabled:opacity-70 transition-opacity"
              style={{ backgroundColor: '#1a6fc4', fontSize: '16px' }}
            >
              {isSubmitting ? 'Logging in…' : 'Log In'}
            </button>

            {/* Or continue with */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500 pt-1">
              New here?{' '}
              <Link
                to="/TaperPayerSignup"
                className="text-orange-500 font-semibold hover:text-orange-600"
              >
                Create Account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      <div className="h-4" />
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>
  );
}