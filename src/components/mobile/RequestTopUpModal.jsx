import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/AppAuthContext';

const COUNTRIES = [
  { name: 'Afghanistan', flag: '🇦🇫', dial: '+93' },
  { name: 'Albania', flag: '🇦🇱', dial: '+355' },
  { name: 'Algeria', flag: '🇩🇿', dial: '+213' },
  { name: 'Andorra', flag: '🇦🇩', dial: '+376' },
  { name: 'Angola', flag: '🇦🇴', dial: '+244' },
  { name: 'Argentina', flag: '🇦🇷', dial: '+54' },
  { name: 'Armenia', flag: '🇦🇲', dial: '+374' },
  { name: 'Australia', flag: '🇦🇺', dial: '+61' },
  { name: 'Austria', flag: '🇦🇹', dial: '+43' },
  { name: 'Azerbaijan', flag: '🇦🇿', dial: '+994' },
  { name: 'Bahamas', flag: '🇧🇸', dial: '+1242' },
  { name: 'Bahrain', flag: '🇧🇭', dial: '+973' },
  { name: 'Bangladesh', flag: '🇧🇩', dial: '+880' },
  { name: 'Barbados', flag: '🇧🇧', dial: '+1246' },
  { name: 'Belarus', flag: '🇧🇾', dial: '+375' },
  { name: 'Belgium', flag: '🇧🇪', dial: '+32' },
  { name: 'Belize', flag: '🇧🇿', dial: '+501' },
  { name: 'Benin', flag: '🇧🇯', dial: '+229' },
  { name: 'Bhutan', flag: '🇧🇹', dial: '+975' },
  { name: 'Bolivia', flag: '🇧🇴', dial: '+591' },
  { name: 'Bosnia and Herzegovina', flag: '🇧🇦', dial: '+387' },
  { name: 'Botswana', flag: '🇧🇼', dial: '+267' },
  { name: 'Brazil', flag: '🇧🇷', dial: '+55' },
  { name: 'Brunei', flag: '🇧🇳', dial: '+673' },
  { name: 'Bulgaria', flag: '🇧🇬', dial: '+359' },
  { name: 'Burkina Faso', flag: '🇧🇫', dial: '+226' },
  { name: 'Burundi', flag: '🇧🇮', dial: '+257' },
  { name: 'Cambodia', flag: '🇰🇭', dial: '+855' },
  { name: 'Cameroon', flag: '🇨🇲', dial: '+237' },
  { name: 'Canada', flag: '🇨🇦', dial: '+1' },
  { name: 'Cape Verde', flag: '🇨🇻', dial: '+238' },
  { name: 'Chad', flag: '🇹🇩', dial: '+235' },
  { name: 'Chile', flag: '🇨🇱', dial: '+56' },
  { name: 'China', flag: '🇨🇳', dial: '+86' },
  { name: 'Colombia', flag: '🇨🇴', dial: '+57' },
  { name: 'Comoros', flag: '🇰🇲', dial: '+269' },
  { name: 'Congo', flag: '🇨🇬', dial: '+242' },
  { name: 'Costa Rica', flag: '🇨🇷', dial: '+506' },
  { name: 'Croatia', flag: '🇭🇷', dial: '+385' },
  { name: 'Cuba', flag: '🇨🇺', dial: '+53' },
  { name: 'Cyprus', flag: '🇨🇾', dial: '+357' },
  { name: 'Czech Republic', flag: '🇨🇿', dial: '+420' },
  { name: 'Denmark', flag: '🇩🇰', dial: '+45' },
  { name: 'Djibouti', flag: '🇩🇯', dial: '+253' },
  { name: 'Dominican Republic', flag: '🇩🇴', dial: '+1809' },
  { name: 'Ecuador', flag: '🇪🇨', dial: '+593' },
  { name: 'Egypt', flag: '🇪🇬', dial: '+20' },
  { name: 'El Salvador', flag: '🇸🇻', dial: '+503' },
  { name: 'Equatorial Guinea', flag: '🇬🇶', dial: '+240' },
  { name: 'Eritrea', flag: '🇪🇷', dial: '+291' },
  { name: 'Estonia', flag: '🇪🇪', dial: '+372' },
  { name: 'Eswatini', flag: '🇸🇿', dial: '+268' },
  { name: 'Ethiopia', flag: '🇪🇹', dial: '+251' },
  { name: 'Fiji', flag: '🇫🇯', dial: '+679' },
  { name: 'Finland', flag: '🇫🇮', dial: '+358' },
  { name: 'France', flag: '🇫🇷', dial: '+33' },
  { name: 'Gabon', flag: '🇬🇦', dial: '+241' },
  { name: 'Gambia', flag: '🇬🇲', dial: '+220' },
  { name: 'Georgia', flag: '🇬🇪', dial: '+995' },
  { name: 'Germany', flag: '🇩🇪', dial: '+49' },
  { name: 'Ghana', flag: '🇬🇭', dial: '+233' },
  { name: 'Greece', flag: '🇬🇷', dial: '+30' },
  { name: 'Grenada', flag: '🇬🇩', dial: '+1473' },
  { name: 'Guatemala', flag: '🇬🇹', dial: '+502' },
  { name: 'Guinea', flag: '🇬🇳', dial: '+224' },
  { name: 'Guinea-Bissau', flag: '🇬🇼', dial: '+245' },
  { name: 'Guyana', flag: '🇬🇾', dial: '+592' },
  { name: 'Haiti', flag: '🇭🇹', dial: '+509' },
  { name: 'Honduras', flag: '🇭🇳', dial: '+504' },
  { name: 'Hong Kong', flag: '🇭🇰', dial: '+852' },
  { name: 'Hungary', flag: '🇭🇺', dial: '+36' },
  { name: 'Iceland', flag: '🇮🇸', dial: '+354' },
  { name: 'India', flag: '🇮🇳', dial: '+91' },
  { name: 'Indonesia', flag: '🇮🇩', dial: '+62' },
  { name: 'Iran', flag: '🇮🇷', dial: '+98' },
  { name: 'Iraq', flag: '🇮🇶', dial: '+964' },
  { name: 'Ireland', flag: '🇮🇪', dial: '+353' },
  { name: 'Israel', flag: '🇮🇱', dial: '+972' },
  { name: 'Italy', flag: '🇮🇹', dial: '+39' },
  { name: 'Jamaica', flag: '🇯🇲', dial: '+1876' },
  { name: 'Japan', flag: '🇯🇵', dial: '+81' },
  { name: 'Jordan', flag: '🇯🇴', dial: '+962' },
  { name: 'Kazakhstan', flag: '🇰🇿', dial: '+7' },
  { name: 'Kenya', flag: '🇰🇪', dial: '+254' },
  { name: 'Kiribati', flag: '🇰🇮', dial: '+686' },
  { name: 'Kosovo', flag: '🇽🇰', dial: '+383' },
  { name: 'Kuwait', flag: '🇰🇼', dial: '+965' },
  { name: 'Kyrgyzstan', flag: '🇰🇬', dial: '+996' },
  { name: 'Laos', flag: '🇱🇦', dial: '+856' },
  { name: 'Latvia', flag: '🇱🇻', dial: '+371' },
  { name: 'Lebanon', flag: '🇱🇧', dial: '+961' },
  { name: 'Lesotho', flag: '🇱🇸', dial: '+266' },
  { name: 'Liberia', flag: '🇱🇷', dial: '+231' },
  { name: 'Libya', flag: '🇱🇾', dial: '+218' },
  { name: 'Liechtenstein', flag: '🇱🇮', dial: '+423' },
  { name: 'Lithuania', flag: '🇱🇹', dial: '+370' },
  { name: 'Luxembourg', flag: '🇱🇺', dial: '+352' },
  { name: 'Macao', flag: '🇲🇴', dial: '+853' },
  { name: 'Madagascar', flag: '🇲🇬', dial: '+261' },
  { name: 'Malawi', flag: '🇲🇼', dial: '+265' },
  { name: 'Malaysia', flag: '🇲🇾', dial: '+60' },
  { name: 'Maldives', flag: '🇲🇻', dial: '+960' },
  { name: 'Mali', flag: '🇲🇱', dial: '+223' },
  { name: 'Malta', flag: '🇲🇹', dial: '+356' },
  { name: 'Marshall Islands', flag: '🇲🇭', dial: '+692' },
  { name: 'Mauritania', flag: '🇲🇷', dial: '+222' },
  { name: 'Mauritius', flag: '🇲🇺', dial: '+230' },
  { name: 'Mexico', flag: '🇲🇽', dial: '+52' },
  { name: 'Micronesia', flag: '🇫🇲', dial: '+691' },
  { name: 'Moldova', flag: '🇲🇩', dial: '+373' },
  { name: 'Monaco', flag: '🇲🇨', dial: '+377' },
  { name: 'Mongolia', flag: '🇲🇳', dial: '+976' },
  { name: 'Montenegro', flag: '🇲🇪', dial: '+382' },
  { name: 'Morocco', flag: '🇲🇦', dial: '+212' },
  { name: 'Mozambique', flag: '🇲🇿', dial: '+258' },
  { name: 'Myanmar', flag: '🇲🇲', dial: '+95' },
  { name: 'Namibia', flag: '🇳🇦', dial: '+264' },
  { name: 'Nauru', flag: '🇳🇷', dial: '+674' },
  { name: 'Nepal', flag: '🇳🇵', dial: '+977' },
  { name: 'Netherlands', flag: '🇳🇱', dial: '+31' },
  { name: 'New Zealand', flag: '🇳🇿', dial: '+64' },
  { name: 'Nicaragua', flag: '🇳🇮', dial: '+505' },
  { name: 'Niger', flag: '🇳🇪', dial: '+227' },
  { name: 'Nigeria', flag: '🇳🇬', dial: '+234' },
  { name: 'North Korea', flag: '🇰🇵', dial: '+850' },
  { name: 'North Macedonia', flag: '🇲🇰', dial: '+389' },
  { name: 'Norway', flag: '🇳🇴', dial: '+47' },
  { name: 'Oman', flag: '🇴🇲', dial: '+968' },
  { name: 'Pakistan', flag: '🇵🇰', dial: '+92' },
  { name: 'Palau', flag: '🇵🇼', dial: '+680' },
  { name: 'Palestine', flag: '🇵🇸', dial: '+970' },
  { name: 'Panama', flag: '🇵🇦', dial: '+507' },
  { name: 'Papua New Guinea', flag: '🇵🇬', dial: '+675' },
  { name: 'Paraguay', flag: '🇵🇾', dial: '+595' },
  { name: 'Peru', flag: '🇵🇪', dial: '+51' },
  { name: 'Philippines', flag: '🇵🇭', dial: '+63' },
  { name: 'Poland', flag: '🇵🇱', dial: '+48' },
  { name: 'Portugal', flag: '🇵🇹', dial: '+351' },
  { name: 'Qatar', flag: '🇶🇦', dial: '+974' },
  { name: 'Romania', flag: '🇷🇴', dial: '+40' },
  { name: 'Russia', flag: '🇷🇺', dial: '+7' },
  { name: 'Rwanda', flag: '🇷🇼', dial: '+250' },
  { name: 'Saint Kitts and Nevis', flag: '🇰🇳', dial: '+1869' },
  { name: 'Saint Lucia', flag: '🇱🇨', dial: '+1758' },
  { name: 'Saint Vincent and the Grenadines', flag: '🇻🇨', dial: '+1784' },
  { name: 'Samoa', flag: '🇼🇸', dial: '+685' },
  { name: 'San Marino', flag: '🇸🇲', dial: '+378' },
  { name: 'Sao Tome and Principe', flag: '🇸🇹', dial: '+239' },
  { name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966' },
  { name: 'Senegal', flag: '🇸🇳', dial: '+221' },
  { name: 'Serbia', flag: '🇷🇸', dial: '+381' },
  { name: 'Seychelles', flag: '🇸🇨', dial: '+248' },
  { name: 'Sierra Leone', flag: '🇸🇱', dial: '+232' },
  { name: 'Singapore', flag: '🇸🇬', dial: '+65' },
  { name: 'Slovakia', flag: '🇸🇰', dial: '+421' },
  { name: 'Slovenia', flag: '🇸🇮', dial: '+386' },
  { name: 'Solomon Islands', flag: '🇸🇧', dial: '+677' },
  { name: 'Somalia', flag: '🇸🇴', dial: '+252' },
  { name: 'South Africa', flag: '🇿🇦', dial: '+27' },
  { name: 'South Korea', flag: '🇰🇷', dial: '+82' },
  { name: 'South Sudan', flag: '🇸🇸', dial: '+211' },
  { name: 'Spain', flag: '🇪🇸', dial: '+34' },
  { name: 'Sri Lanka', flag: '🇱🇰', dial: '+94' },
  { name: 'Sudan', flag: '🇸🇩', dial: '+249' },
  { name: 'Suriname', flag: '🇸🇷', dial: '+597' },
  { name: 'Sweden', flag: '🇸🇪', dial: '+46' },
  { name: 'Switzerland', flag: '🇨🇭', dial: '+41' },
  { name: 'Syria', flag: '🇸🇾', dial: '+963' },
  { name: 'Taiwan', flag: '🇹🇼', dial: '+886' },
  { name: 'Tajikistan', flag: '🇹🇯', dial: '+992' },
  { name: 'Tanzania', flag: '🇹🇿', dial: '+255' },
  { name: 'Thailand', flag: '🇹🇭', dial: '+66' },
  { name: 'Timor-Leste', flag: '🇹🇱', dial: '+670' },
  { name: 'Togo', flag: '🇹🇬', dial: '+228' },
  { name: 'Tonga', flag: '🇹🇴', dial: '+676' },
  { name: 'Trinidad and Tobago', flag: '🇹🇹', dial: '+1868' },
  { name: 'Tunisia', flag: '🇹🇳', dial: '+216' },
  { name: 'Turkey', flag: '🇹🇷', dial: '+90' },
  { name: 'Turkmenistan', flag: '🇹🇲', dial: '+993' },
  { name: 'Tuvalu', flag: '🇹🇻', dial: '+688' },
  { name: 'Uganda', flag: '🇺🇬', dial: '+256' },
  { name: 'Ukraine', flag: '🇺🇦', dial: '+380' },
  { name: 'United Arab Emirates', flag: '🇦🇪', dial: '+971' },
  { name: 'United Kingdom', flag: '🇬🇧', dial: '+44' },
  { name: 'United States', flag: '🇺🇸', dial: '+1' },
  { name: 'Uruguay', flag: '🇺🇾', dial: '+598' },
  { name: 'Uzbekistan', flag: '🇺🇿', dial: '+998' },
  { name: 'Vanuatu', flag: '🇻🇺', dial: '+678' },
  { name: 'Vatican City', flag: '🇻🇦', dial: '+379' },
  { name: 'Venezuela', flag: '🇻🇪', dial: '+58' },
  { name: 'Vietnam', flag: '🇻🇳', dial: '+84' },
  { name: 'Yemen', flag: '🇾🇪', dial: '+967' },
  { name: 'Zambia', flag: '🇿🇲', dial: '+260' },
  { name: 'Zimbabwe', flag: '🇿🇼', dial: '+263' },
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
  const [requesterCountry, setRequesterCountry] = useState(null);
  const [myPhone, setMyPhone] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('sms');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [myCountrySearch, setMyCountrySearch] = useState('');
  const [requesterCountrySearch, setRequesterCountrySearch] = useState('');

  const generatedNote = myCountry ? `Please send Top up my ${myCountry.name} ${myCountry.flag}` : '';

  const filteredMyCountries = useMemo(() => {
    if (!myCountrySearch) return COUNTRIES;
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(myCountrySearch.toLowerCase()));
  }, [myCountrySearch]);

  const filteredRequesterCountries = useMemo(() => {
    if (!requesterCountrySearch) return COUNTRIES;
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(requesterCountrySearch.toLowerCase()));
  }, [requesterCountrySearch]);

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
      
      try {
        await base44.functions.invoke('sendNotification', {
          type: 'request_topup',
          recipient: requesterPhone,
          myPhone,
          senderName,
          amount,
          note: finalNote,
          topupLink,
          deliveryMethod,
        });
      } catch {
        // Fallback to SMS if WhatsApp fails
        await base44.functions.invoke('sendNotification', {
          type: 'request_topup',
          recipient: requesterPhone,
          myPhone,
          senderName,
          amount,
          note: finalNote,
          topupLink,
          deliveryMethod: 'sms',
        });
      }
      setSuccess(true);
    } catch (err) {
      setError('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMyCountry(null);
    setRequesterCountry(null);
    setMyPhone('');
    setRequesterPhone('');
    setAmount('');
    setNote('');
    setDeliveryMethod('sms');
    setSuccess(false);
    setError('');
    setMyCountrySearch('');
    setRequesterCountrySearch('');
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
                    setMyCountrySearch('');
                  }}>
                    <SelectTrigger style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>
                      <SelectValue placeholder="Search country..." />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search countries..."
                          value={myCountrySearch}
                          onChange={(e) => setMyCountrySearch(e.target.value)}
                          style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                          className="mb-2"
                        />
                      </div>
                      {filteredMyCountries.map((country) => (
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Their country <span className="text-red-500">*</span></label>
                  <Select value={requesterCountry?.name || ''} onValueChange={(countryName) => {
                    const country = COUNTRIES.find(c => c.name === countryName);
                    setRequesterCountry(country);
                    setRequesterPhone('');
                    setRequesterCountrySearch('');
                  }}>
                    <SelectTrigger style={{ color: '#1e293b', backgroundColor: '#ffffff' }}>
                      <SelectValue placeholder="Search country..." />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search countries..."
                          value={requesterCountrySearch}
                          onChange={(e) => setRequesterCountrySearch(e.target.value)}
                          style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                          className="mb-2"
                        />
                      </div>
                      {filteredRequesterCountries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Who are you requesting from? <span className="text-red-500">*</span></label>
                  <Input
                    type="tel"
                    placeholder={requesterCountry ? `Enter their number for ${requesterCountry.name}` : 'Select their country first'}
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    disabled={!requesterCountry}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Send via <span className="text-red-500">*</span></label>
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