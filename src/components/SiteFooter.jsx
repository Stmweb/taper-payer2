import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Instagram } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer id="contact" className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png" alt="Taper Payer Logo" className="w-56 h-auto mb-4" />
            <p className="text-slate-300 text-lg mb-4">Your trusted partner for secure and efficient global money transfers.</p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61583727643100" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#3D7BB7' }}><span className="text-white text-lg">f</span></a>
              <a href="https://x.com/Taperpayer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#61AF39' }}><span className="text-white text-lg">𝕏</span></a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#F88F2B' }}><span className="text-white text-lg">in</span></a>
              <a href="https://www.instagram.com/taperpayerofficial/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}><Instagram className="w-5 h-5 text-white" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-xl">Quick Links</h4>
            <ul className="space-y-3 text-slate-300">
              <li><Link to="/TaperPayerHome" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> Home</Link></li>
              <li><Link to="/TaperPayerAbout" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> About Us</Link></li>
              <li><Link to="/TaperPayerHowItWorks" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> How It Works</Link></li>
              <li><Link to="/TaperPayerRates" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> Exchange Rates</Link></li>
              <li><Link to="/TaperPayerTopUp" className="hover:text-white transition-colors flex items-center gap-2"><span style={{ color: '#61AF39' }}>›</span> Taper Mobile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-xl">Resources</h4>
            <ul className="space-y-3 text-slate-300">
              <li><Link to="/TaperPayerFAQ" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/TaperPayerTerms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/TaperPayerPrivacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/TaperPayerCookies" className="hover:text-white transition-colors">Cookies Policy</Link></li>
              <li><Link to="/TaperPayerWhiteLabel" className="hover:text-white transition-colors">White Label</Link></li>
              <li><Link to="/TaperPayerAML" className="hover:text-white transition-colors">AML Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-xl">Contact Us</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#3D7BB7' }} />
                <span>254 Chapman Rd, Ste 208 #26415<br />Newark, Delaware 19702</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-5 h-5 flex-shrink-0" style={{ color: '#61AF39' }} />
                <a href="mailto:info@taperpayer.com" className="hover:text-white transition-colors">info@taperpayer.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg" style={{ color: '#F88F2B' }}>☎</span>
                <a href="tel:404-994-0766" className="hover:text-white transition-colors">404-994-0766</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
            <p>&copy; 2026 Taper Payer LLC. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}