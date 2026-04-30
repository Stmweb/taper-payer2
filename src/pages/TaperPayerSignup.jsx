import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';
import MobileHeader from '@/components/mobile/MobileHeader';
import CountryDrawer from '@/components/mobile/CountryDrawer';
import { useIsMobile } from '@/hooks/use-mobile';
import SignupModal from '@/components/SignupModal';
import { useAppAuth } from '@/lib/AppAuthContext';
import { base44 } from '@/api/base44Client';

export default function TaperPayerSignup() {
  const isMobile = useIsMobile();
  const { login } = useAppAuth();

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
  const [showStateDrawer, setShowStateDrawer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ];



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!sendSMS) {
      setErrorMsg('Please agree to the User Agreement.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
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
      setSubmitStatus('success');
      setTimeout(() => { window.location.href = '/TaperPayerHome'; }, 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row dark:bg-slate-900">
      <MobileHeader title="Sign Up" showBack={true} />
      {/* Left Side - Promotional Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-700 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
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
              src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/cd20725cb_A5D49075-7B3C-46FA-9202-6E68DF5CFC46.png"
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
      <div className="w-full lg:w-1/2 flex items-start justify-center px-5 pt-4 pb-28 bg-white dark:bg-slate-900 lg:items-center lg:pt-8 lg:pb-8 overflow-y-auto relative">
        <Link to={createPageUrl('TaperPayerHome')} className="hidden lg:flex absolute top-6 right-6 w-9 h-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors z-10">
          <X className="w-5 h-5" />
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6">
            <Link to={createPageUrl('TaperPayerHome')}>
              <img 
                src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/1bfa6df02_TaperPayerVeryGood.png"
                alt="Taper Payer"
                className="h-24 md:h-36 w-auto mx-auto mb-4 mix-blend-multiply dark:mix-blend-normal"
              />
            </Link>
            <h2 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Register your account, it's free!
            </h2>
          </div>

          {/* World Cup Banner - mobile only */}
          <div className="lg:hidden mb-6 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/cd20725cb_A5D49075-7B3C-46FA-9202-6E68DF5CFC46.png"
              alt="World Cup Raffle 2026"
              className="w-full h-auto"
            />
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
                  className="w-full pl-12 h-12 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-md text-slate-900 bg-white appearance-none"
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
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10" style={{ backgroundColor: '#2479C2' }} />
                <button
                  type="button"
                  onClick={() => setShowStateDrawer(true)}
                  className="w-full pl-12 pr-4 py-3 h-12 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-md text-left flex items-center justify-between"
                  style={{ userSelect: 'none' }}
                >
                  <span className={formData.state ? '' : 'text-gray-400'}>{formData.state || 'Select State'}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <CountryDrawer
              open={showStateDrawer}
              onOpenChange={setShowStateDrawer}
              countries={states}
              value={formData.state}
              onSelect={(state) => setFormData({...formData, state})}
              title="Select State"
            />

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
            <div className="text-xs text-slate-600 dark:text-gray-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
              <p className="font-semibold mb-1">Password must contain:</p>
              <ul className="space-y-1 ml-4">
                <li>• One Number</li>
                <li>• One Capital Letter</li>
                <li>• One Small Letter</li>
                <li>• One Special Character</li>
                <li>• Password min length is 8 and max length is 16</li>
              </ul>
            </div>

            {/* User Agreement */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="agreement"
                checked={sendSMS}
                onCheckedChange={setSendSMS}
                required
              />
              <label htmlFor="agreement" className="text-sm text-slate-600 leading-tight">
                I agree to the{' '}
                <a href="https://cdn.prod.website-files.com/691c3ed36cbe630ffe6844b3/696ea2d4c3253c82181f6aca_250505%20Cybrid%20User%20Agreement.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">User Agreement</a>
              </label>
            </div>

            {submitStatus === 'success' && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 text-sm text-center">
                ✓ Account created! Redirecting…
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
              {isSubmitting ? 'Creating Account…' : 'Register'}
            </Button>

            <div className="text-center text-sm text-slate-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to={createPageUrl('TaperPayerLogin')} className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Login here
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