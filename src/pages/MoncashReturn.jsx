import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, AlertCircle, Loader2, Phone, Share2, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MoncashReturn() {
  const [status, setStatus] = useState('loading');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Case 1: Redirected here from our own moncashCallback GET (already processed server-side)
    if (params.get('success') === '1') {
      setPhone(params.get('phone') || '');
      setAmount(params.get('amount') || '');
      setStatus('success');
      return;
    }
    if (params.get('failed') === '1') {
      setStatus('failed');
      return;
    }
    if (params.get('error')) {
      setErrorMsg('Payment could not be verified. Please contact support.');
      setStatus('error');
      return;
    }

    // Case 2: Moncash redirected user directly here with orderId/token — process via API
    const orderId = params.get('orderId');
    const token = params.get('token');

    if (!orderId && !token) {
      setErrorMsg('No order information received.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    // Use plain fetch (no auth required) to call the callback endpoint
    fetch(`/api/apps/695c31d62d68bbb4ef8cc5b3/functions/moncashCallback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, token }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data?.success || data?.already_completed) {
          setPhone(data.phone || '');
          setAmount(data.amount || '');
          setStatus('success');
        } else {
          setErrorMsg(data?.error || 'Top-up could not be completed.');
          setStatus('failed');
        }
      })
      .catch(err => {
        console.error('Moncash callback error:', err);
        setErrorMsg('An error occurred while processing your top-up. Please try again or contact support.');
        setStatus('error');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        <img
          src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/f3100c512_TPGT.png"
          alt="Taper Payer"
          className="h-28 w-auto mx-auto mb-6 object-contain"
        />

        {(status === 'loading' || status === 'processing') && (
          <div className="py-6">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {status === 'loading' ? 'Loading...' : 'Processing your top-up...'}
            </h2>
            <p className="text-slate-500 text-sm">Please wait while we send the airtime. Do not close this page.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-2">
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
                <span className="text-sm font-bold text-blue-600">🇭🇹 MonCash</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">✓ Confirmed</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs mb-5">A confirmation has been processed. The airtime should arrive within seconds.</p>

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
        )}

        {status === 'failed' && (
          <div className="py-4">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Received — Top-Up Pending</h2>
            <p className="text-slate-500 text-sm mb-2">Your Moncash payment was received but the airtime could not be sent automatically.</p>
            {errorMsg && <p className="text-xs text-red-500 mb-4 bg-red-50 rounded-lg p-3">{errorMsg}</p>}
            <p className="text-slate-600 text-sm mb-6">Please contact our support team and we'll resolve this right away.</p>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@taperpayer.com">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Contact Support</Button>
              </a>
              <Link to="/TaperPayerTopUp">
                <Button variant="outline" className="w-full">Go Back</Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something Went Wrong</h2>
            <p className="text-slate-500 text-sm mb-6">{errorMsg || 'We could not verify your payment. Please contact support.'}</p>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@taperpayer.com">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Contact Support</Button>
              </a>
              <Link to="/TaperPayerTopUp">
                <Button variant="outline" className="w-full">Try Again</Button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}