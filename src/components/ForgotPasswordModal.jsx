import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState('email'); // email | otp | success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.functions.invoke('forgotPassword', { action: 'request-reset', email });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await base44.functions.invoke('forgotPassword', {
        action: 'reset-password',
        email,
        otp,
        new_password: newPassword,
      });
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'email' && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Forgot Password</h2>
            <p className="text-slate-500 mb-6 text-sm">Enter your email and we'll send you a reset code.</p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
              </div>
            )}
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : 'Send Reset Code'}
              </Button>
              <div className="text-center">
                <button type="button" onClick={handleClose} className="text-sm text-slate-500 hover:text-blue-600">
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Reset Password</h2>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2 text-blue-700 text-sm">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              Reset code sent to <strong>{email}</strong>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
              </div>
            )}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">6-Digit Code</label>
                <Input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength="6"
                  inputMode="numeric"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...</> : 'Reset Password'}
              </Button>
              <div className="text-center">
                <button type="button" onClick={() => { setStep('email'); setError(''); }} className="text-sm text-slate-500 hover:text-blue-600">
                  Resend Code
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Password Reset!</h2>
            <p className="text-slate-500 mb-6">Your password has been updated successfully.</p>
            <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Back to Login
            </Button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}