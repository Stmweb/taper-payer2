import React, { useState } from 'react';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';
import MobileHeader from '@/components/mobile/MobileHeader';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';

export default function TaperPayerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAppAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMsg('');
    try {
      const res = await base44.functions.invoke('login', { email, password });
      const { jwt, user, cybrid_customer_id } = res.data;
      localStorage.setItem('auth_token', jwt);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('cybrid_customer_id', cybrid_customer_id);
      login(user, jwt, cybrid_customer_id);
      setSubmitStatus('success');
      window.location.href = '/TaperPayerHome';
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Login failed. Please check your email and password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row dark:bg-slate-900">
      <MobileHeader title="Login" showBack={true} />
      {/* Left Side - Promotional Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl"
        >
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Get the app
          </h1>
          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8">
            Download our app for free to send money online in minutes. Track your payments and view your transfer history from anywhere.
          </p>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 inline-block">
            <div className="w-48 h-48 bg-white p-2 border-2 border-slate-200 rounded-lg">
              <svg viewBox="0 0 29 29" className="w-full h-full">
                <rect width="29" height="29" fill="white"/>
                {/* Corner markers */}
                <rect x="0" y="0" width="7" height="7" fill="black"/>
                <rect x="1" y="1" width="5" height="5" fill="white"/>
                <rect x="2" y="2" width="3" height="3" fill="black"/>
                <rect x="22" y="0" width="7" height="7" fill="black"/>
                <rect x="23" y="1" width="5" height="5" fill="white"/>
                <rect x="24" y="2" width="3" height="3" fill="black"/>
                <rect x="0" y="22" width="7" height="7" fill="black"/>
                <rect x="1" y="23" width="5" height="5" fill="white"/>
                <rect x="2" y="24" width="3" height="3" fill="black"/>
                {/* Random pattern */}
                <rect x="9" y="0" width="1" height="1" fill="black"/>
                <rect x="11" y="0" width="1" height="1" fill="black"/>
                <rect x="13" y="0" width="1" height="1" fill="black"/>
                <rect x="15" y="0" width="1" height="1" fill="black"/>
                <rect x="8" y="2" width="1" height="1" fill="black"/>
                <rect x="10" y="2" width="1" height="1" fill="black"/>
                <rect x="12" y="2" width="1" height="1" fill="black"/>
                <rect x="14" y="2" width="1" height="1" fill="black"/>
                <rect x="16" y="2" width="1" height="1" fill="black"/>
                <rect x="18" y="2" width="1" height="1" fill="black"/>
                <rect x="20" y="2" width="1" height="1" fill="black"/>
                <rect x="9" y="4" width="1" height="1" fill="black"/>
                <rect x="11" y="4" width="1" height="1" fill="black"/>
                <rect x="15" y="4" width="1" height="1" fill="black"/>
                <rect x="17" y="4" width="1" height="1" fill="black"/>
                <rect x="19" y="4" width="1" height="1" fill="black"/>
                <rect x="8" y="6" width="1" height="1" fill="black"/>
                <rect x="10" y="6" width="1" height="1" fill="black"/>
                <rect x="12" y="6" width="1" height="1" fill="black"/>
                <rect x="16" y="6" width="1" height="1" fill="black"/>
                <rect x="18" y="6" width="1" height="1" fill="black"/>
                <rect x="20" y="6" width="1" height="1" fill="black"/>
                <rect x="0" y="8" width="1" height="1" fill="black"/>
                <rect x="2" y="8" width="1" height="1" fill="black"/>
                <rect x="4" y="8" width="1" height="1" fill="black"/>
                <rect x="6" y="8" width="1" height="1" fill="black"/>
                <rect x="9" y="8" width="1" height="1" fill="black"/>
                <rect x="11" y="8" width="1" height="1" fill="black"/>
                <rect x="13" y="8" width="1" height="1" fill="black"/>
                <rect x="15" y="8" width="1" height="1" fill="black"/>
                <rect x="18" y="8" width="1" height="1" fill="black"/>
                <rect x="20" y="8" width="1" height="1" fill="black"/>
                <rect x="23" y="8" width="1" height="1" fill="black"/>
                <rect x="25" y="8" width="1" height="1" fill="black"/>
                <rect x="27" y="8" width="1" height="1" fill="black"/>
                <rect x="9" y="9" width="1" height="1" fill="black"/>
                <rect x="12" y="9" width="1" height="1" fill="black"/>
                <rect x="14" y="9" width="1" height="1" fill="black"/>
                <rect x="17" y="9" width="1" height="1" fill="black"/>
                <rect x="19" y="9" width="1" height="1" fill="black"/>
                <rect x="22" y="9" width="1" height="1" fill="black"/>
                <rect x="24" y="9" width="1" height="1" fill="black"/>
                <rect x="26" y="9" width="1" height="1" fill="black"/>
                <rect x="8" y="10" width="1" height="1" fill="black"/>
                <rect x="11" y="10" width="1" height="1" fill="black"/>
                <rect x="13" y="10" width="1" height="1" fill="black"/>
                <rect x="16" y="10" width="1" height="1" fill="black"/>
                <rect x="19" y="10" width="1" height="1" fill="black"/>
                <rect x="21" y="10" width="1" height="1" fill="black"/>
                <rect x="23" y="10" width="1" height="1" fill="black"/>
                <rect x="26" y="10" width="1" height="1" fill="black"/>
                <rect x="9" y="11" width="1" height="1" fill="black"/>
                <rect x="12" y="11" width="1" height="1" fill="black"/>
                <rect x="15" y="11" width="1" height="1" fill="black"/>
                <rect x="17" y="11" width="1" height="1" fill="black"/>
                <rect x="20" y="11" width="1" height="1" fill="black"/>
                <rect x="22" y="11" width="1" height="1" fill="black"/>
                <rect x="25" y="11" width="1" height="1" fill="black"/>
                <rect x="27" y="11" width="1" height="1" fill="black"/>
                <rect x="10" y="12" width="1" height="1" fill="black"/>
                <rect x="13" y="12" width="1" height="1" fill="black"/>
                <rect x="16" y="12" width="1" height="1" fill="black"/>
                <rect x="18" y="12" width="1" height="1" fill="black"/>
                <rect x="21" y="12" width="1" height="1" fill="black"/>
                <rect x="24" y="12" width="1" height="1" fill="black"/>
                <rect x="26" y="12" width="1" height="1" fill="black"/>
                <rect x="8" y="13" width="1" height="1" fill="black"/>
                <rect x="11" y="13" width="1" height="1" fill="black"/>
                <rect x="14" y="13" width="1" height="1" fill="black"/>
                <rect x="17" y="13" width="1" height="1" fill="black"/>
                <rect x="19" y="13" width="1" height="1" fill="black"/>
                <rect x="22" y="13" width="1" height="1" fill="black"/>
                <rect x="25" y="13" width="1" height="1" fill="black"/>
                <rect x="28" y="13" width="1" height="1" fill="black"/>
                <rect x="9" y="14" width="1" height="1" fill="black"/>
                <rect x="12" y="14" width="1" height="1" fill="black"/>
                <rect x="15" y="14" width="1" height="1" fill="black"/>
                <rect x="18" y="14" width="1" height="1" fill="black"/>
                <rect x="20" y="14" width="1" height="1" fill="black"/>
                <rect x="23" y="14" width="1" height="1" fill="black"/>
                <rect x="26" y="14" width="1" height="1" fill="black"/>
                <rect x="8" y="16" width="1" height="1" fill="black"/>
                <rect x="10" y="16" width="1" height="1" fill="black"/>
                <rect x="13" y="16" width="1" height="1" fill="black"/>
                <rect x="16" y="16" width="1" height="1" fill="black"/>
                <rect x="19" y="16" width="1" height="1" fill="black"/>
                <rect x="21" y="16" width="1" height="1" fill="black"/>
                <rect x="24" y="16" width="1" height="1" fill="black"/>
                <rect x="27" y="16" width="1" height="1" fill="black"/>
                <rect x="9" y="18" width="1" height="1" fill="black"/>
                <rect x="12" y="18" width="1" height="1" fill="black"/>
                <rect x="14" y="18" width="1" height="1" fill="black"/>
                <rect x="17" y="18" width="1" height="1" fill="black"/>
                <rect x="20" y="18" width="1" height="1" fill="black"/>
                <rect x="22" y="18" width="1" height="1" fill="black"/>
                <rect x="25" y="18" width="1" height="1" fill="black"/>
                <rect x="28" y="18" width="1" height="1" fill="black"/>
                <rect x="0" y="20" width="1" height="1" fill="black"/>
                <rect x="2" y="20" width="1" height="1" fill="black"/>
                <rect x="4" y="20" width="1" height="1" fill="black"/>
                <rect x="6" y="20" width="1" height="1" fill="black"/>
                <rect x="8" y="20" width="1" height="1" fill="black"/>
                <rect x="11" y="20" width="1" height="1" fill="black"/>
                <rect x="13" y="20" width="1" height="1" fill="black"/>
                <rect x="16" y="20" width="1" height="1" fill="black"/>
                <rect x="18" y="20" width="1" height="1" fill="black"/>
                <rect x="21" y="20" width="1" height="1" fill="black"/>
                <rect x="24" y="20" width="1" height="1" fill="black"/>
                <rect x="26" y="20" width="1" height="1" fill="black"/>
                <rect x="9" y="22" width="1" height="1" fill="black"/>
                <rect x="11" y="22" width="1" height="1" fill="black"/>
                <rect x="14" y="22" width="1" height="1" fill="black"/>
                <rect x="16" y="22" width="1" height="1" fill="black"/>
                <rect x="19" y="22" width="1" height="1" fill="black"/>
                <rect x="22" y="22" width="1" height="1" fill="black"/>
                <rect x="24" y="22" width="1" height="1" fill="black"/>
                <rect x="27" y="22" width="1" height="1" fill="black"/>
                <rect x="8" y="24" width="1" height="1" fill="black"/>
                <rect x="10" y="24" width="1" height="1" fill="black"/>
                <rect x="13" y="24" width="1" height="1" fill="black"/>
                <rect x="15" y="24" width="1" height="1" fill="black"/>
                <rect x="18" y="24" width="1" height="1" fill="black"/>
                <rect x="21" y="24" width="1" height="1" fill="black"/>
                <rect x="23" y="24" width="1" height="1" fill="black"/>
                <rect x="26" y="24" width="1" height="1" fill="black"/>
                <rect x="28" y="24" width="1" height="1" fill="black"/>
                <rect x="9" y="26" width="1" height="1" fill="black"/>
                <rect x="12" y="26" width="1" height="1" fill="black"/>
                <rect x="14" y="26" width="1" height="1" fill="black"/>
                <rect x="17" y="26" width="1" height="1" fill="black"/>
                <rect x="20" y="26" width="1" height="1" fill="black"/>
                <rect x="22" y="26" width="1" height="1" fill="black"/>
                <rect x="25" y="26" width="1" height="1" fill="black"/>
                <rect x="27" y="26" width="1" height="1" fill="black"/>
                <rect x="8" y="28" width="1" height="1" fill="black"/>
                <rect x="11" y="28" width="1" height="1" fill="black"/>
                <rect x="13" y="28" width="1" height="1" fill="black"/>
                <rect x="16" y="28" width="1" height="1" fill="black"/>
                <rect x="19" y="28" width="1" height="1" fill="black"/>
                <rect x="21" y="28" width="1" height="1" fill="black"/>
                <rect x="24" y="28" width="1" height="1" fill="black"/>
                <rect x="26" y="28" width="1" height="1" fill="black"/>
              </svg>
            </div>
            <p className="text-sm text-slate-600 mt-4 max-w-xs">
              Scan this QR code with your phone to download our app!
            </p>
          </div>

          {/* Promo Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
            }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ delay: 0.3 }}
            className="mb-8 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          >
            <motion.img 
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/adbf945ac_TaperPayerBanner.png"
              alt="World Cup Raffle 2026"
              className="w-full h-auto"
            />
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">104K+</div>
              <div className="text-sm text-slate-600">Satisfied Customers</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">✓</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">34K+</div>
              <div className="text-sm text-slate-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📍</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">6.4K+</div>
              <div className="text-sm text-slate-600">Locations</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-5 pt-4 pb-28 bg-white dark:bg-slate-900 lg:items-center lg:pt-8 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6">
            <Link to={createPageUrl('TaperPayerHome')}>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/6af1701ab_GrokTaperpayer.png"
                alt="Taper Payer"
                className="h-24 md:h-36 w-auto mx-auto mb-4 mix-blend-multiply dark:mix-blend-normal"
              />
            </Link>
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome, please login to your account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="pl-12 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="pl-12 h-12"
                  required
                />
              </div>
              <div className="text-right mt-2">
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-slate-500 hover:text-blue-600">
                  Forgot your password?
                </button>
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
                ✓ Logging you in…
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                {errorMsg}
              </div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-semibold disabled:opacity-70"
              style={{ backgroundColor: '#2479C2', userSelect: 'none' }}
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to={createPageUrl('TaperPayerSignup')} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                New Sign up
              </Link>
            </div>

            <div className="text-center">
              <Link
                to={createPageUrl('TaperPayerHome')}
                className="text-sm text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Back To Home
              </Link>
            </div>
          </form>

          {/* Security Badges */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <Shield className="w-5 h-5" />
              <span className="text-xs font-semibold">SECURE</span>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                VISA
              </div>
              <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-red-600">
                MC
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>
  );
}