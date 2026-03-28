import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';

const COUNTRIES = [
  { name: 'Haiti', flag: '🇭🇹', dial: '+509' },
  { name: 'USA', flag: '🇺🇸', dial: '+1' },
  { name: 'Nigeria', flag: '🇳🇬', dial: '+234' },
  { name: 'Ghana', flag: '🇬🇭', dial: '+233' },
  { name: 'Jamaica', flag: '🇯🇲', dial: '+1876' },
  { name: 'Kenya', flag: '🇰🇪', dial: '+254' },
  { name: 'Brazil', flag: '🇧🇷', dial: '+55' },
  { name: 'Mexico', flag: '🇲🇽', dial: '+52' },
];

function detectCountry(phone) {
  if (!phone || phone.trim().length < 5) return null;
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return null;
  if (cleaned.endsWith('509') || cleaned.startsWith('509')) return { name: 'Haiti', flag: '🇭🇹' };
  if (cleaned.endsWith('1876') || cleaned.startsWith('1876')) return { name: 'Jamaica', flag: '🇯🇲' };
  if (cleaned.startsWith('1') && cleaned.length >= 10) return { name: 'USA', flag: '🇺🇸' };
  if (cleaned.startsWith('234')) return { name: 'Nigeria', flag: '🇳🇬' };
  if (cleaned.startsWith('233')) return { name: 'Ghana', flag: '🇬🇭' };
  if (cleaned.startsWith('254')) return { name: 'Kenya', flag: '🇰🇪' };
  if (cleaned.startsWith('55')) return { name: 'Brazil', flag: '🇧🇷' };
  if (cleaned.startsWith('52')) return { name: 'Mexico', flag: '🇲🇽' };
  return null;
}

export default function RequestTopUpModal({ isOpen, onClose }) {
  const { user } = useAppAuth();
  const [myCountry, setMyCountry] = useState(null);
  const [myPhone, setMyPhone] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const generatedNote = myCountry ? `Please send Top up my ${myCountry.name} ${myCountry.flag}` : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!myPhone || !requesterPhone || !amount) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const senderName = user?.full_name || 'Someone';
      const topupLink = `https://taperpayer.com/TaperPayerTopUp`;
      const finalNote = note || generatedNote;
      await base44.functions.invoke('sendNotification', {
        type: 'request_topup',
        recipient: requesterPhone,
        myPhone,
        senderName,
        amount,
        note: finalNote,
        topupLink,
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMyCountry(null);
    setMyPhone('');
    setRequesterPhone('');
    setAmount('');
    setNote('');
    setSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 text-slate-500">✕</button>

        <div className="p-6 pt-4">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Request sent!</h3>
              <p className="text-slate-500 text-sm">We've sent them an SMS & WhatsApp message with a link to top up your phone. You'll be notified once it's done.</p>
              <Button onClick={handleClose} className="mt-6 w-full" style={{ backgroundColor: '#F88F2B' }}>Done</Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Request a Top-Up</h2>
              <p className="text-slate-500 text-sm mb-6">Ask someone to recharge your phone via SMS or WhatsApp.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country <span className="text-red-500">*</span></label>
                  <Select value={myCountry?.name || ''} onValueChange={(countryName) => {
                    const country = COUNTRIES.find(c => c.name === countryName);
                    setMyCountry(country);
                    setMyPhone('');
                  }}>
                    <SelectTrigger style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your phone number <span className="text-red-500">*</span></label>
                  <Input
                    type="tel"
                    placeholder={myCountry ? `Enter number for ${myCountry.name}` : 'Select country first'}
                    value={myPhone}
                    onChange={(e) => setMyPhone(e.target.value)}
                    disabled={!myCountry}
                    required
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                  <p className="text-xs text-slate-400 mt-1">This is the number that will receive the top-up</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Who are you requesting from? <span className="text-red-500">*</span></label>
                  <Input
                    type="tel"
                    placeholder="Enter their phone number"
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    required
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                  <p className="text-xs text-slate-400 mt-1">They'll receive an SMS & WhatsApp message with a link to top you up</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount (USD) <span className="text-red-500">*</span></label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Note <span className="text-slate-400 font-normal">(optional)</span></label>
                  <Input
                    type="text"
                    placeholder={generatedNote || "Add a message"}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                  {generatedNote && !note && <p className="text-xs text-slate-400 mt-1">Message will auto-generate based on your phone's country</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white"
                  style={{ backgroundColor: '#F88F2B' }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : '📲 Send via SMS & WhatsApp'}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}