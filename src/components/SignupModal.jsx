import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Loader2, AlertCircle } from 'lucide-react';

export default function SignupModal({ isOpen, onClose, onSignupSuccess }) {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await base44.functions.invoke('signup', formData);
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2 text-slate-900">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="text-slate-600 mb-6">
          {isLogin ? 'Welcome back!' : 'Get started with TaperPayer'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <Input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
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
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
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
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}