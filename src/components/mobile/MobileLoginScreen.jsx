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