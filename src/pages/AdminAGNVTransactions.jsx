import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminAGNVTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const query = filter === 'all' ? {} : { status: filter };
      const txs = await base44.entities.AgnvTransaction.filter(query, '-created_date', 100);
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (txId) => {
    try {
      await base44.functions.invoke('approveAGNVTransaction', {
        transactionId: txId,
        approved: true,
      });
      fetchTransactions();
      setSelectedTx(null);
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const handleReject = async (txId) => {
    try {
      await base44.functions.invoke('approveAGNVTransaction', {
        transactionId: txId,
        approved: false,
        rejectionReason,
      });
      fetchTransactions();
      setSelectedTx(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  };

  const statusIcon = {
    pending: <Clock className="w-5 h-5 text-yellow-500" />,
    completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    failed: <XCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AGNV Transactions</h1>
        <p className="text-slate-600 mb-6">Review and approve AGNV transfers</p>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {['pending', 'completed', 'failed', 'all'].map(status => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                fetchTransactions();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No transactions found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">From</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">To</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {statusIcon[tx.status]}
                        <span className="text-sm font-medium capitalize text-slate-900">{tx.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{tx.created_by}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{tx.recipient_name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">${tx.amount_usd}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(tx.created_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {tx.status === 'pending' && (
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="px-3 py-1 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">Review Transaction</h2>

            <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
              <p><span className="font-medium text-slate-700">From:</span> {selectedTx.created_by}</p>
              <p><span className="font-medium text-slate-700">To:</span> {selectedTx.recipient_name}</p>
              <p><span className="font-medium text-slate-700">Phone:</span> {selectedTx.recipient_phone}</p>
              <p><span className="font-medium text-slate-700">Amount:</span> ${selectedTx.amount_usd} USD = {selectedTx.amount_agnv} AGNV</p>
              <p><span className="font-medium text-slate-700">Date:</span> {new Date(selectedTx.created_date).toLocaleString()}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rejection Reason (if rejecting)</label>
              <Input
                type="text"
                placeholder="Optional"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedTx(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedTx.id)}
                className="flex-1 px-4 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 font-medium transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedTx.id)}
                className="flex-1 px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 font-medium transition-colors"
              >
                Approve
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}