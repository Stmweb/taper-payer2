import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

export default function TaperPayerSignup() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    country: 'United States',
    state: '',
    referralCode: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sendSMS, setSendSMS] = useState(false);
  const [sendPromo, setSendPromo] = useState(false);

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Connecticut',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana',
    'Maryland', 'New York'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Registration logic here
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Promotional Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-green-50 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Get the app
          </h1>
          <p className="text-xl text-slate-600 mb-8">
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white mb-8"
          >
            <p className="text-sm uppercase tracking-wide mb-2 opacity-90">Current Offer(s)</p>
            <h2 className="text-4xl font-bold mb-2">GET UP TO</h2>
            <p className="text-6xl font-black mb-2" style={{ color: '#F88F2B' }}>5% DISCOUNT</p>
            <p className="text-xl">ON YOUR FIRST TRANSACTION</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">30K+</div>
              <div className="text-sm text-slate-600">Satisfied Customers</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">✓</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">9.9K+</div>
              <div className="text-sm text-slate-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">📍</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">1.8K+</div>
              <div className="text-sm text-slate-600">Locations</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to={createPageUrl('TaperPayerHome')}>
              <TaperPayerLogo height="h-32" className="mx-auto mb-6" />
            </Link>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Register your account, it's free!
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="First Name"
                  className="pl-12 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                  placeholder="Middle Name (optional)"
                  className="pl-12 h-12"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Last Name"
                  className="pl-12 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email"
                  className="pl-12 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10" style={{ backgroundColor: '#2479C2' }} />
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 h-12 border border-gray-300 rounded-md appearance-none bg-white"
                  required
                >
                  <option>United States</option>
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10" style={{ backgroundColor: '#2479C2' }} />
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 h-12 border border-gray-300 rounded-md appearance-none bg-white"
                  required
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                  placeholder="Referral Code (optional)"
                  className="pl-12 h-12"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  placeholder="Mobile"
                  className="pl-12 h-12"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Password"
                  className="pl-12 pr-12 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white"
                  style={{ backgroundColor: '#2479C2' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" style={{ backgroundColor: '#2479C2' }} />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm Password"
                  className="pl-12 pr-12 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white"
                  style={{ backgroundColor: '#2479C2' }}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg">
              <p className="font-semibold mb-1">Password must contain:</p>
              <ul className="space-y-1 ml-4">
                <li>• One Number</li>
                <li>• One Capital Letter</li>
                <li>• One Small Letter</li>
                <li>• One Special Character</li>
                <li>• Password min length is 8 and max length is 16</li>
              </ul>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="sms"
                  checked={sendSMS}
                  onCheckedChange={setSendSMS}
                />
                <label htmlFor="sms" className="text-sm text-slate-600 leading-tight">
                  Send me OTP (One Time Password) via SMS to complete registration
                </label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="promo"
                  checked={sendPromo}
                  onCheckedChange={setSendPromo}
                />
                <label htmlFor="promo" className="text-sm text-slate-600 leading-tight">
                  Send me Email / SMS about Notifications, Offers, and Promotions.
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              style={{ backgroundColor: '#2479C2' }}
            >
              Register
            </Button>

            <div className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to={createPageUrl('TaperPayerLogin')} className="text-blue-600 hover:underline font-semibold">
                Login here
              </Link>
            </div>

            <div className="text-center">
              <Link
                to={createPageUrl('TaperPayerHome')}
                className="text-sm text-slate-500 hover:text-blue-600"
              >
                Back To Home
              </Link>
            </div>
          </form>

          {/* Security Badges */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <Lock className="w-5 h-5" />
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
    </div>
  );
}