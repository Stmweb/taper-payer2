import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';

const CURRENCIES = ['USD', 'HTG', 'NGN', 'GHS', 'JMD', 'KES', 'BRL', 'MXN'];

const COUNTRIES = [
  { name: 'Haiti', flag: '🇭🇹', dial: '+509' },
  { name: 'United States', flag: '🇺🇸', dial: '+1' },
  { name: 'Nigeria', flag: '🇳🇬', dial: '+234' },
  { name: 'Ghana', flag: '🇬🇭', dial: '+233' },
  { name: 'Jamaica', flag: '🇯🇲', dial: '+1876' },
  { name: 'Kenya', flag: '🇰🇪', dial: '+254' },
  { name: 'Brazil', flag: '🇧🇷', dial: '+55' },
  { name: 'Mexico', flag: '🇲🇽', dial: '+52' },
  { name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { name: 'United Kingdom', flag: '🇬🇧', dial: '+44' },
];

export default function RequestMoneyModal({ isOpen, onClose }) {
  const { user } = useAppAuth();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [recipient, setRecipient] = useState('');
  const [recipientCountry, setRecipientCountry] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('sms');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRIES;
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  }, [countrySearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || !recipient || !recipientCountry) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const senderName = user?.full_name || 'Someone';
      
      // Normalize phone number with country code if it looks like a phone
      const formatRecipient = (value, country) => {
        const isPhone = /^\+?[\d\s\-().]{7,}$/.test(value);
        if (!isPhone) return value; // It's not a phone, return as-is (email)
        if (value.startsWith('+')) return value;
        const dial = country?.dial || '+1';
        return dial + value;
      };
      
      const normalizedRecipient = formatRecipient(recipient, recipientCountry);
      
      // Create payment request with unique URL
      const requestRes = await base44.functions.invoke('createPaymentRequest', {
        recipient: normalizedRecipient,
        recipient_country: recipientCountry.name,
        amount: parseFloat(amount),
        currency,
        note,
        delivery_method: deliveryMethod,
      });

      // Send notification with share URL
      await base44.functions.invoke('sendNotification', {
        type: 'request_money',
        recipient: normalizedRecipient,
        senderName,
        amount,
        currency,
        note,
        recipientCountry: recipientCountry.name,
        deliveryMethod,
        shareUrl: requestRes.data.share_url,
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setCurrency('USD');
    setRecipient('');
    setRecipientCountry(null);
    setDeliveryMethod('sms');
    setNote('');
    setSuccess(false);
    setError('');
    setCountrySearch('');
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
              <div className="flex justify-center mb-4">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png" alt="Taper Payer" className="w-16 h-16" style={{ imageRendering: 'crisp-edges', imageResolution: '300dpi' }} />
              </div>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Request sent!</h3>
              <p className="text-slate-500 text-sm">We've notified them and you'll be alerted when the payment is completed.</p>
              <Button onClick={handleClose} className="mt-6 w-full" style={{ backgroundColor: '#3D7BB7' }}>Done</Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Request money in seconds</h2>
              <p className="text-slate-500 text-sm mb-6">Ask friends, family, or customers to send you money instantly.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-11 px-3 border border-slate-300 rounded-lg text-slate-900 bg-white text-sm"
                    >
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Receiving Country <span className="text-red-500">*</span></label>
                  <Select value={recipientCountry?.name || ''} onValueChange={(countryName) => {
                    const country = COUNTRIES.find(c => c.name === countryName);
                    setRecipientCountry(country);
                    setCountrySearch('');
                  }}>
                    <SelectTrigger style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>
                      <SelectValue placeholder="Search country..." />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search countries..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                          className="mb-2"
                        />
                      </div>
                      {filteredCountries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Method <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('sms')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        deliveryMethod === 'sms'
                          ? 'bg-blue-500 text-white border-2 border-blue-500'
                          : 'bg-slate-100 text-slate-700 border-2 border-transparent hover:bg-slate-200'
                      }`}
                    >
                      💬 SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('whatsapp')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        deliveryMethod === 'whatsapp'
                          ? 'bg-green-500 text-white border-2 border-green-500'
                          : 'bg-slate-100 text-slate-700 border-2 border-transparent hover:bg-slate-200'
                      }`}
                    >
                      💚 WhatsApp
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Who are you requesting from?</label>
                  <Input
                    type="text"
                    placeholder=""
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Note <span className="text-slate-400 font-normal">(optional)</span></label>
                  <Input
                    type="text"
                    placeholder="Add a message so they know what the payment is for."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white"
                  style={{ backgroundColor: '#3D7BB7' }}
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : 'Send Request'}
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