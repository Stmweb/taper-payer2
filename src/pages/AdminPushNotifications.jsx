import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, Send, Users, User, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminPushNotifications() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('general');
  const [mode, setMode] = useState('all'); // 'all' | 'specific'
  const [selectedTokens, setSelectedTokens] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await base44.functions.invoke('getAppUsers', {});
    setUsers(res.data?.users || []);
    setLoadingUsers(false);
  };

  const usersWithTokens = users.filter(u => u.fcm_token);
  const totalTokens = mode === 'all'
    ? usersWithTokens.map(u => u.fcm_token)
    : selectedTokens;

  const toggleUser = (token) => {
    setSelectedTokens(prev =>
      prev.includes(token) ? prev.filter(t => t !== token) : [...prev, token]
    );
  };

  const handleSend = async () => {
    if (!title || !body) return;
    if (totalTokens.length === 0) {
      setResult({ type: 'error', message: 'No recipients with push tokens found.' });
      return;
    }

    setSending(true);
    setResult(null);

    const res = await base44.functions.invoke('sendPushNotification', {
      tokens: totalTokens,
      title,
      body,
      type,
    });

    const results = res.data?.results || [];
    const successCount = results.filter(r => !r.error).length;
    const failCount = results.filter(r => r.error).length;

    setResult({
      type: successCount > 0 ? 'success' : 'error',
      message: `Sent: ${successCount} succeeded, ${failCount} failed out of ${results.length} total.`,
    });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Push Notifications</h1>
              <p className="text-slate-500 text-sm">Send notifications to app users</p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchUsers} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Compose */}
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-500" /> Compose Notification
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <Input
                placeholder="e.g. Your transfer is complete!"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Write your notification message..."
                value={body}
                onChange={e => setBody(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="transaction">Transaction</option>
                <option value="topup">Top-Up</option>
                <option value="promo">Promotional</option>
                <option value="alert">Alert</option>
              </select>
            </div>

            {/* Recipients Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Recipients</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('all')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  All Users ({usersWithTokens.length})
                </button>
                <button
                  onClick={() => setMode('specific')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === 'specific' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                >
                  <User className="w-4 h-4 inline mr-1" />
                  Specific Users
                </button>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${result.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {result.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                {result.message}
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={sending || !title || !body || totalTokens.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending...' : `Send to ${totalTokens.length} device${totalTokens.length !== 1 ? 's' : ''}`}
            </Button>
          </Card>

          {/* Users List */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Users
              <span className="ml-auto text-sm font-normal text-slate-400">
                {usersWithTokens.length} / {users.length} with push enabled
              </span>
            </h2>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-slate-400 py-12">No users found</p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {users.map(u => (
                  <div
                    key={u.id}
                    onClick={() => mode === 'specific' && u.fcm_token && toggleUser(u.fcm_token)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      mode === 'specific' && u.fcm_token ? 'cursor-pointer hover:bg-blue-50' : ''
                    } ${
                      mode === 'specific' && u.fcm_token && selectedTokens.includes(u.fcm_token)
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                      {(u.full_name || u.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{u.full_name || '—'}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${u.fcm_token ? 'bg-green-400' : 'bg-slate-300'}`} title={u.fcm_token ? 'Push enabled' : 'No push token'} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}