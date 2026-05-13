import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { PhoneCall, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const statusIcon = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  pending:   <Clock className="w-3.5 h-3.5 text-amber-400" />,
  failed:    <XCircle className="w-3.5 h-3.5 text-red-400" />,
};

const statusColor = {
  completed: 'text-green-600',
  pending:   'text-amber-500',
  failed:    'text-red-500',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RecentTransactions({ user, filter = 'all' }) {
  const [topups, setTopups] = useState([]);
  const [agnv, setAgnv] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      base44.entities.PendingTopup.filter({ created_by: user.email }, '-created_date', 5),
      base44.entities.AgnvTransaction.filter({ sender_id: user.id }, '-created_date', 5),
    ]).then(([t, a]) => {
      setTopups(t);
      setAgnv(a);
    }).finally(() => setLoading(false));
  }, [user]);

  // Merge and sort by date, take last 5
  let combined = [
    ...topups.map(t => ({
      id: t.id,
      type: 'topup',
      icon: <PhoneCall className="w-5 h-5" style={{ color: '#F88F2B' }} />,
      iconBg: '#fff3e0',
      label: t.operator_name || 'Mobile Top-Up',
      sub: t.phone_number,
      amount: `-$${t.amount?.toFixed(2)}`,
      status: t.status,
      date: t.created_date,
      txType: 'sent',
    })),
    ...agnv.map(a => ({
      id: a.id,
      type: 'agnv',
      icon: <Send className="w-5 h-5" style={{ color: '#3D7BB7' }} />,
      iconBg: '#dbeafe',
      label: `Send to ${a.recipient_name || 'Recipient'}`,
      sub: `${a.amount_agnv} AGNV`,
      amount: `-$${a.amount_usd?.toFixed(2)}`,
      status: a.status,
      date: a.created_date,
      txType: 'sent',
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Apply filter
  if (filter === 'sent') {
    combined = combined.filter(tx => tx.txType === 'sent');
  } else if (filter === 'pending') {
    combined = combined.filter(tx => tx.status === 'pending');
  }

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
          </div>
        ) : combined.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-3xl">💸</span>
            <p className="text-slate-400 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {combined.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: tx.iconBg }}
                >
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-sm truncate">{tx.label}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {statusIcon[tx.status]}
                    <span className={`text-xs font-medium capitalize ${statusColor[tx.status]}`}>{tx.status}</span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-slate-400 text-xs">{formatDate(tx.date)}</span>
                  </div>
                </div>
                <span className="text-slate-800 font-bold text-sm flex-shrink-0">{tx.amount}</span>
              </motion.div>
            ))}
          </div>
        )}
    </div>
  );
}