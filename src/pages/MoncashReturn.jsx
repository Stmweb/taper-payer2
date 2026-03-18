import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, AlertCircle, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MoncashReturn() {
  const [status, setStatus] = useState('loading'); // loading | processing | success | failed | error
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const token = params.get('token');

    if (!orderId && !token) {
      setStatus('error');
      setErrorMsg('No order information found.');
      return;
    }

    // Process the top-up now that user has returned
    setStatus('processing');

    base44.functions.invoke('moncashCallback', { orderId, token })
      .then(res => {
        if (res.data?.success) {
          setPhone(res.data.phone || '');
          setAmount(res.data.amount || '');
          setStatus('success');
        } else if (res.data?.already_completed) {
          setPhone(res.data.phone || '');
          setStatus('success');
        } else {
          setErrorMsg(res.data?.error || 'Top-up could not be completed.');
          setStatus('failed');
        }
      })
      .catch(err => {
        setErrorMsg('An error occurred while processing your top-up.');
        setStatus('error');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">

        {/* Logo */}
        <img
          src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/f3100c512_TPGT.png"
          alt="Taper Payer"
          className="h-16 w-auto mx-auto mb-6 object-contain"
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
          <div className="py-4">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Top-Up Successful! 🎉</h2>
            {phone && (
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                <Phone className="w-4 h-4" />
                <span className="font-medium">{phone}</span>
              </div>
            )}
            {amount && (
              <p className="text-slate-500 text-sm mb-6">Amount: <strong>${parseFloat(amount).toFixed(2)} USD</strong></p>
            )}
            {!amount && !phone && <p className="text-slate-500 mb-6">Your airtime has been sent successfully.</p>}
            <Link to="/TaperPayerTopUp">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Top Up Another Phone</Button>
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="py-4">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Received — Top-Up Pending</h2>
            <p className="text-slate-500 text-sm mb-2">Your Moncash payment was received, but the airtime could not be sent automatically.</p>
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