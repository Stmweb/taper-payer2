import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

function ResultBox({ label, result, loading }) {
  const [expanded, setExpanded] = useState(true);

  if (!result && !loading) return null;

  return (
    <div className="border rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          ) : result?.ok ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span className="font-medium text-slate-800 text-sm">{label}</span>
          {result && (
            <Badge variant={result.ok ? 'default' : 'destructive'} className="text-xs">
              {result.status}
            </Badge>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </div>
      {expanded && result && (
        <pre className="p-4 text-xs bg-white overflow-auto max-h-80 text-slate-700">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function PrepayNationTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  // Form state
  const [baseUrl, setBaseUrl] = useState('https://api.prepaynation.com');
  const [country, setCountry] = useState('HT');
  const [productType, setProductType] = useState('');
  const [productId, setProductId] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('');

  const call = async (action, params = {}) => {
    setLoading(l => ({ ...l, [action]: true }));
    setResults(r => ({ ...r, [action]: null }));
    try {
      const res = await base44.functions.invoke('prepayNation', { action, baseUrl, ...params });
      setResults(r => ({ ...r, [action]: res.data }));
    } catch (err) {
      setResults(r => ({ ...r, [action]: { ok: false, status: 'Error', data: { error: err.message } } }));
    } finally {
      setLoading(l => ({ ...l, [action]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h1 className="text-2xl font-bold text-slate-900">PrepayNation API Test</h1>
          <p className="text-slate-500 text-sm mt-1">Sandbox environment — test all endpoints before going live</p>
          <div className="flex gap-2 mt-3">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Sandbox</Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Valuetopup API</Badge>
          </div>
        </div>

        {/* Base URL Config */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
          <h2 className="font-semibold text-slate-800">⚙️ API Configuration</h2>
          <p className="text-xs text-slate-500">Enter the base URL provided by PrepayNation in your welcome email or dashboard.</p>
          <Input
            placeholder="e.g. https://api.prepaynation.com or https://uat.prepaynation.com"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            style={{ color: '#1e293b', backgroundColor: '#fff' }}
          />
          <div className="flex gap-2 flex-wrap">
            {['https://api.prepaynation.com', 'https://uat.prepaynation.com', 'https://staging.prepaynation.com', 'https://api.valuetopup.com'].map(url => (
              <button key={url} onClick={() => setBaseUrl(url)} className={`text-xs px-3 py-1 rounded-full border transition-all ${baseUrl === url ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                {url.replace('https://', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
          <h2 className="font-semibold text-slate-800">1. Account Balance</h2>
          <Button onClick={() => call('balance')} disabled={loading.balance} className="w-full">
            {loading.balance ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Check Balance
          </Button>
          <ResultBox label="Balance Response" result={results.balance} loading={loading.balance} />
        </div>

        {/* Operators */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
          <h2 className="font-semibold text-slate-800">2. Operators by Country</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Country code e.g. HT, US, NG"
              value={country}
              onChange={e => setCountry(e.target.value)}
              style={{ color: '#1e293b', backgroundColor: '#fff' }}
            />
            <Button onClick={() => call('operators', { country })} disabled={loading.operators} className="whitespace-nowrap">
              {loading.operators ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Operators'}
            </Button>
          </div>
          <ResultBox label="Operators Response" result={results.operators} loading={loading.operators} />
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
          <h2 className="font-semibold text-slate-800">3. Products / Catalog</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Country code e.g. HT, NG"
              value={country}
              onChange={e => setCountry(e.target.value)}
              style={{ color: '#1e293b', backgroundColor: '#fff' }}
            />
            <Input
              placeholder="Type: airtime, data, gift_card..."
              value={productType}
              onChange={e => setProductType(e.target.value)}
              style={{ color: '#1e293b', backgroundColor: '#fff' }}
            />
            <Button onClick={() => call('products', { country, type: productType })} disabled={loading.products} className="whitespace-nowrap">
              {loading.products ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Products'}
            </Button>
          </div>
          <ResultBox label="Products Response" result={results.products} loading={loading.products} />
        </div>

        {/* Top-Up */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
          <h2 className="font-semibold text-slate-800">4. Execute Top-Up</h2>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Product ID"
              value={productId}
              onChange={e => setProductId(e.target.value)}
              style={{ color: '#1e293b', backgroundColor: '#fff' }}
            />
            <Input
              placeholder="MSISDN (phone) e.g. +50938331291"
              value={msisdn}
              onChange={e => setMsisdn(e.target.value)}
              style={{ color: '#1e293b', backgroundColor: '#fff' }}
            />
            <Input
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ color: '#1e293b', backgroundColor: '#fff' }}
            />
          </div>
          <Button
            onClick={() => call('topup', { productId, msisdn, amount })}
            disabled={loading.topup || !productId || !msisdn}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {loading.topup ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit Top-Up
          </Button>
          <ResultBox label="Top-Up Response" result={results.topup} loading={loading.topup} />
        </div>

        {/* Transaction Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
          <h2 className="font-semibold text-slate-800">5. Transaction Status</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Transaction ID"
              value={txId}
              onChange={e => setTxId(e.target.value)}
              style={{ color: '#1e293b', backgroundColor: '#fff' }}
            />
            <Button onClick={() => call('transaction_status', { transactionId: txId })} disabled={loading.transaction_status || !txId} className="whitespace-nowrap">
              {loading.transaction_status ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check Status'}
            </Button>
          </div>
          <ResultBox label="Transaction Status Response" result={results.transaction_status} loading={loading.transaction_status} />
        </div>

      </div>
    </div>
  );
}