import React from 'react';
import { CheckCircle, Home, RefreshCw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ThankYou() {
  const params = new URLSearchParams(window.location.search);
  const phone = params.get('phone') || '';
  const amount = params.get('amount') || '';
  const method = params.get('method') || 'Card';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        <img
          src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/f3100c512_TPGT.png"
          alt="Taper Payer"
          className="h-28 w-auto mx-auto mb-6 object-contain"
        />

        {/* Animated success icon */}
        <div className="relative w-24 h-24 mx-auto mb-5">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
          <div className="relative flex items-center justify-center w-24 h-24 bg-green-50 rounded-full border-4 border-green-200">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-1">Thank You! 🎉</h2>
        <p className="text-green-600 font-semibold text-base mb-4">Your top-up was sent successfully</p>

        {/* Receipt card */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Transaction Receipt</p>
          {phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Phone Number</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{phone}</span>
            </div>
          )}
          {amount && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Amount Sent</span>
              <span className="text-sm font-bold text-slate-800">${parseFloat(amount).toFixed(2)} USD</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Payment Method</span>
            <span className="text-sm font-bold text-blue-600">💳 {method}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Status</span>
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">✓ Confirmed</span>
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-5">The airtime should arrive within seconds.</p>

        <div className="flex flex-col gap-3">
          <Link to="/TaperPayerTopUp">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <RefreshCw className="w-4 h-4" /> Top Up Another Phone
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}