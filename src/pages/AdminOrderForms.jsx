import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ChevronLeft, Eye, RefreshCw, Search } from 'lucide-react';

const STATUS_STYLES = {
  new: 'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  new: 'New',
  in_review: 'In Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export default function AdminOrderForms() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await base44.entities.OrderFormSubmission.list('-created_date', 100);
    setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await base44.entities.OrderFormSubmission.update(id, { status });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    setUpdatingId(null);
  };

  const filtered = submissions.filter(s =>
    s.partner_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.sponsor_email?.toLowerCase().includes(search.toLowerCase()) ||
    s.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-500 hover:text-slate-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <img src="https://media.base44.com/images/public/695c31d62d68bbb4ef8cc5b3/4b81ac0a6_TPGT.png" alt="Taper Payer" className="h-10 w-auto" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Partner Order Forms</h1>
            <p className="text-xs text-slate-500">{submissions.length} submission{submissions.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* List Panel */}
        <div className="w-full lg:w-1/2 xl:w-2/5 border-r border-slate-200 flex flex-col bg-white">
          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by partner, email, country..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Status summary */}
          <div className="px-4 py-3 flex gap-2 flex-wrap border-b border-slate-100">
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = submissions.filter(s => s.status === key).length;
              return (
                <span key={key} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[key]}`}>
                  {label}: {count}
                </span>
              );
            })}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No submissions found.</div>
            ) : filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors ${selected?.id === s.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{s.partner_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.sponsor_email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.country} · {s.monthly_minimum_tier || '—'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[s.status] || STATUS_STYLES.new}`}>
                      {STATUS_LABELS[s.status] || 'New'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {s.created_date ? new Date(s.created_date).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="hidden lg:flex flex-1 flex-col overflow-y-auto">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a submission to view details</p>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selected.partner_name}</h2>
                  <p className="text-sm text-slate-500">Submitted {selected.created_date ? new Date(selected.created_date).toLocaleString() : '—'}</p>
                </div>
                <div className="flex gap-2">
                  {['new', 'in_review', 'approved', 'rejected'].map(st => (
                    <button
                      key={st}
                      disabled={updatingId === selected.id || selected.status === st}
                      onClick={() => updateStatus(selected.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity disabled:opacity-40 ${selected.status === st ? STATUS_STYLES[st] + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {STATUS_LABELS[st]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Sections */}
              {[
                {
                  title: 'Partner Information',
                  fields: [
                    ['Partner Name', selected.partner_name],
                    ['Billing Address', selected.billing_address],
                    ['Country', selected.country],
                    ['Project Sponsor', selected.project_sponsor],
                    ['Sponsor Email', selected.sponsor_email],
                  ]
                },
                {
                  title: 'Billing Contact',
                  fields: [
                    ['Name', selected.billing_contact_name],
                    ['Email', selected.billing_contact_email],
                    ['Phone', selected.billing_contact_phone],
                  ]
                },
                {
                  title: 'Partner Lead',
                  fields: [
                    ['Name', selected.implementation_lead],
                    ['Email', selected.implementation_lead_email],
                    ['Phone', selected.implementation_phone],
                  ]
                },
                {
                  title: 'Order Details',
                  fields: [
                    ['Implementation Billing Start', selected.implementation_billing_start_date],
                    ['Monthly Min Fee Start Date', selected.monthly_minimum_platform_fee_start_date],
                    ['Monthly Minimum Tier', selected.monthly_minimum_tier],
                  ]
                },
                {
                  title: 'Signature',
                  fields: [
                    ['Signatory Name', selected.signatory_name],
                    ['Email', selected.email_address],
                    ['Date Signed', selected.date_signed],
                  ]
                },
              ].map(section => (
                <div key={section.title} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">{section.title}</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {section.fields.map(([label, value]) => (
                      <div key={label} className="flex px-4 py-2.5 gap-4">
                        <span className="text-xs text-slate-500 w-44 flex-shrink-0 pt-0.5">{label}</span>
                        <span className="text-sm text-slate-900 font-medium">{value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}