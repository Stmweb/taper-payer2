import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import SignupModal from '@/components/SignupModal';
import { useAppAuth } from '@/lib/AppAuthContext';

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { user, logout } = useAppAuth();

  return (
    <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative flex items-center justify-between h-14 md:h-16">
          {/* Mobile Menu Button - Left */}
          <button
            className="md:hidden text-slate-700 p-2 z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Centered on Mobile, Left on Desktop */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 flex-shrink-0">
            <img 
              src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png"
              alt="Taper Payer"
              className="h-36 md:h-36 w-auto"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Home</Link>
            <Link to="/TaperPayerAbout" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">About</Link>
            <Link to="/TaperPayerHowItWorks" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">How It Works</Link>
            <Link to="/TaperPayerRates" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Exchange Rates</Link>
            <Link to="/TaperPayerTopUp" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Taper Mobile</Link>
            <Link to="/TaperPayerContact" className="text-slate-700 dark:text-gray-200 text-sm lg:text-base font-medium hover:text-[#3D7BB7] transition-colors">Contact</Link>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{user.email}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  className="text-slate-700 dark:text-gray-200"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSignupModal(true)}
                  className="text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  Login
                </Button>
                <a href="https://bluepaycard.wwcnyotm.com/gb/en/gb/MTS/Account/Register" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" style={{ backgroundColor: '#3D7BB7' }} className="hover:opacity-90">Sign up</Button>
                </a>
              </>
            )}
          </div>

          {/* Spacer for Mobile to Balance Layout */}
          <div className="md:hidden w-10"></div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-br from-blue-600 to-green-600 -mx-4 px-4 py-6 space-y-3 rounded-b-2xl">
            <Link to="/" className="block text-white font-semibold hover:text-white transition-colors py-2">Home</Link>
            <Link to="/TaperPayerAbout" className="block text-white/90 font-medium hover:text-white transition-colors py-2">About</Link>
            <Link to="/TaperPayerHowItWorks" className="block text-white/90 font-medium hover:text-white transition-colors py-2">How It Works</Link>
            <Link to="/TaperPayerRates" className="block text-white/90 font-medium hover:text-white transition-colors py-2">Exchange Rates</Link>
            <Link to="/TaperPayerTopUp" className="block text-white/90 font-medium hover:text-white transition-colors py-2">Taper Mobile</Link>
            <Link to="/TaperPayerContact" className="block text-white/90 font-medium hover:text-white transition-colors py-2">Contact</Link>
            <div className="pt-3 space-y-3">
              {user ? (
                <>
                  <div className="bg-white/10 rounded-lg p-3 text-white mb-3">
                    <p className="text-sm font-semibold">{user.full_name}</p>
                    <p className="text-xs text-white/70">{user.email}</p>
                  </div>
                  <Button 
                    onClick={logout}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSignupModal(true)}
                    className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => setShowSignupModal(true)}
                    className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)}
        onSignupSuccess={() => {
          setShowSignupModal(false);
          window.location.reload();
        }}
      />
    </nav>
  );
}