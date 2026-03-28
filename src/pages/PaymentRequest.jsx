import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { AlertCircle, Copy, CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentRequest() {
  const [searchParams] = useSearchParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const requestId = searchParams.get('id');

  useEffect(() => {
    async function fetchRequest() {
      try {
        if (!requestId) {
          setError('Invalid request link');
          setLoading(false);
          return;
        }

        const requests = await base44.entities.PaymentRequest.filter({
          request_id: requestId,
        });

        if (requests.length === 0) {
          setError('Payment request not found or has expired');
          setLoading(false);
          return;
        }

        const paymentRequest = requests[0];

        // Check expiration
        if (new Date(paymentRequest.expires_at) < new Date()) {
          setError('This payment request has expired');
          setLoading(false);
          return;
        }

        setRequest(paymentRequest);
      } catch (err) {
        setError('Failed to load payment request');
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [requestId]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Request Error</h2>
              <p className="text-slate-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <Button
            onClick={() => (window.location.href = '/')}
            className="w-full"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Payment Request</h1>
            <p className="text-blue-100 text-sm">
              {request?.sender_name} is requesting payment
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Amount */}
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-1">Amount Requested</p>
              <p className="text-4xl font-bold text-slate-900">
                {request?.currency} {request?.amount}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 border-y border-slate-200 py-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  From
                </p>
                <p className="text-slate-900 font-medium">{request?.sender_name}</p>
              </div>

              {request?.note && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Note
                  </p>
                  <p className="text-slate-700 text-sm italic">{request?.note}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Request ID
                </p>
                <p className="text-slate-900 font-mono text-sm font-medium">
                  {request?.request_id}
                </p>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-900 mb-3">Share This Request</p>
              <Button
                onClick={handleCopyUrl}
                variant="outline"
                className="w-full gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                Share this link via email, SMS, or social media
              </p>
            </div>

            {/* Status */}
            {request?.status === 'paid' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900">Payment Received</p>
                  <p className="text-xs text-green-700">This request has been paid</p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Awaiting Payment</p>
                  <p className="text-xs text-blue-700">
                    Expires {new Date(request?.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Action */}
            <Button
              onClick={() => (window.location.href = '/')}
              className="w-full"
              style={{ backgroundColor: '#3D7BB7' }}
            >
              Make Payment
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Powered by Taper Payer
        </p>
      </div>
    </div>
  );
}