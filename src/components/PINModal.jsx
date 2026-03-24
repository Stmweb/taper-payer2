import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Lock } from 'lucide-react';

const CORRECT_PIN = '28272017';

export default function PINModal({ isOpen, onSuccess, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (pin !== CORRECT_PIN) {
      setError('Invalid PIN. Please try again.');
      return;
    }
    setPin('');
    setError('');
    onSuccess();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Security Verification</h3>
            <p className="text-sm text-slate-500">Enter your PIN code to continue</p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">PIN Code</label>
          <Input
            type="text"
            placeholder="Enter PIN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleVerify()}
            maxLength="8"
            className="text-lg tracking-widest"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={pin.length === 0}
            className="flex-1"
            style={{ backgroundColor: '#3D7BB7' }}
          >
            Verify
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}