import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircle, Settings, LogIn, UserPlus, HelpCircle,
  Shield, FileText, Phone, ChevronRight
} from 'lucide-react';
import { useAppAuth } from '@/lib/AppAuthContext';

const menuItems = [
  { icon: Settings, label: 'Account Settings', link: '/AccountSettings', color: '#3D7BB7', bg: '#e3f2fd' },
  { icon: Phone, label: 'Contact Us', link: '/TaperPayerContact', color: '#61AF39', bg: '#e8f5e9' },
  { icon: HelpCircle, label: 'How It Works', link: '/TaperPayerHowItWorks', color: '#F88F2B', bg: '#fff3e0' },
  { icon: Shield, label: 'Privacy Policy', link: '/TaperPayerPrivacy', color: '#9c27b0', bg: '#f3e5f5' },
  { icon: FileText, label: 'Terms of Service', link: '/TaperPayerTerms', color: '#607d8b', bg: '#eceff1' },
];

export default function MobileProfile() {
  const { user } = useAppAuth();

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
      </div>

      {/* User Card */}
      <div className="mx-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">
                {user?.full_name || 'Guest User'}
              </p>
              <p className="text-white/70 text-sm">
                {user?.email || 'Not logged in'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Auth Buttons (if not logged in) */}
      {!user && (
        <div className="mx-5 mb-6 flex gap-3">
          <Link
            to="/TaperPayerLogin"
            className="flex-1 flex items-center justify-center gap-2 bg-white rounded-2xl py-3 shadow-sm border border-slate-100 font-semibold text-slate-700"
          >
            <LogIn className="w-5 h-5" style={{ color: '#3D7BB7' }} />
            Login
          </Link>
          <Link
            to="/TaperPayerSignup"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3D7BB7, #61AF39)' }}
          >
            <UserPlus className="w-5 h-5 text-white" />
            Sign Up
          </Link>
        </div>
      )}

      {/* Menu Items */}
      <div className="px-5 space-y-3">
        {menuItems.map(({ icon: Icon, label, link, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={link}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-slate-800 font-medium flex-1">{label}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Branding */}
      <div className="mt-10 flex flex-col items-center gap-1 text-slate-400 text-xs pb-4">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695c31d62d68bbb4ef8cc5b3/6af1701ab_GrokTaperpayer.png"
          alt="Taper Payer"
          className="h-14 w-auto mix-blend-multiply"
        />
        <p>Taper Payer © 2026</p>
      </div>
    </div>
  );
}