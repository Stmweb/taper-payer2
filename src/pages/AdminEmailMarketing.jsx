import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail, Users, Send, Plus, Trash2, Upload, CheckCircle2, AlertCircle,
  Clock, Sparkles, Eye, X, Calendar, FileText, RefreshCw, List, Pencil
} from 'lucide-react';
import { EMAIL_TEMPLATES, TEMPLATE_CATEGORIES } from '@/components/email/EmailTemplates';

const statusBadge = {
  sent: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  failed: 'bg-red-100 text-red-600',
  scheduled: 'bg-blue-100 text-blue-700',
};

export default function AdminEmailMarketing() {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [toast, setToast] = useState(null);

  // New subscriber form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newTags, setNewTags] = useState('');

  // Contact lists
  const [contactLists, setContactLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [editingList, setEditingList] = useState(null);
  const [listSubscriberSearch, setListSubscriberSearch] = useState('');

  // Compose form
  const [campaign, setCampaign] = useState({ name: '', subject: '', body_html: '', category: '', sender_email: 'noreply@mail.taperpayer.com', sender_name: 'Taper Payer', contact_list_id: '', recipient_mode: 'list', manual_emails: '' });
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  // Templates
  const [templateCategory, setTemplateCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Bulk import
  const [bulkEmails, setBulkEmails] = useState('');
  const [importing, setImporting] = useState(false);
  const [deduplicating, setDeduplicating] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    setCampaignsLoading(true);
    // Fetch campaigns and lists quickly first
    const [cams, lists] = await Promise.all([
      base44.entities.EmailCampaign.list('-created_date', 50),
      base44.entities.ContactList.list('-created_date', 50)
    ]);
    setCampaigns(cams);
    setContactLists(lists);
    setCampaignsLoading(false);
    // Then fetch subscribers (can be large)
    const subs = await base44.entities.Subscriber.list('-created_date', 5000);
    setSubscribers(subs);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addSubscriber = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    await base44.entities.Subscriber.create({
      email: newEmail.trim(), name: newName.trim(), status: 'active',
      tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [],
      source: 'manual'
    });
    setNewEmail(''); setNewName(''); setNewTags('');
    showToast('Subscriber added!');
    fetchData();
  };

  const removeSubscriber = async (id) => {
    await base44.entities.Subscriber.delete(id);
    showToast('Subscriber removed.');
    fetchData();
  };

  const unsubscribe = async (id) => {
    await base44.entities.Subscriber.update(id, { status: 'unsubscribed' });
    showToast('Subscriber unsubscribed.');
    fetchData();
  };

  const bulkImport = async () => {
    if (!bulkEmails.trim()) return;
    const lines = bulkEmails.split('\n').map(l => l.trim()).filter(Boolean);
    const records = [];
    for (const line of lines) {
      const parts = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
      let email, name;
      if (parts.length >= 3) {
        const possibleEmail = parts.find(p => p.trim().includes('@'));
        email = possibleEmail ? possibleEmail.trim() : null;
        const nonEmailParts = parts.filter(p => !p.trim().includes('@') && p.trim());
        name = nonEmailParts.join(' ').trim();
      } else {
        [email, name] = parts;
        email = email ? email.trim() : null;
        name = name ? name.trim() : '';
      }
      if (email && email.includes('@')) {
        records.push({ email, name: name || '', status: 'active', source: 'import' });
      }
    }
    if (records.length === 0) {
      showToast('No valid email addresses found.', 'error');
      return;
    }
    setImporting(true);
    try {
      const res = await base44.functions.invoke('bulkImportSubscribers', { records });
      const { imported, errors } = res.data;
      setBulkEmails('');
      showToast(`${imported} subscribers imported!${errors?.length ? ` (${errors.length} failed)` : ''}`);
      fetchData();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Import failed.', 'error');
    }
    setImporting(false);
  };

  const deduplicateSubscribers = async () => {
    if (!window.confirm('This will remove all duplicate subscribers (keeping the most recent per email). Continue?')) return;
    setDeduplicating(true);
    try {
      const res = await base44.functions.invoke('deduplicateSubscribers', {});
      showToast(`✅ Removed ${res.data.deleted} duplicates. ${res.data.remaining} subscribers remain.`);
      fetchData();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Deduplication failed.', 'error');
    }
    setDeduplicating(false);
  };

  const createContactList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    await base44.entities.ContactList.create({ name: newListName.trim(), description: newListDesc.trim(), subscriber_ids: [] });
    setNewListName(''); setNewListDesc('');
    showToast('Contact list created!');
    fetchData();
  };

  const deleteContactList = async (id) => {
    await base44.entities.ContactList.delete(id);
    showToast('List deleted.');
    fetchData();
  };

  const toggleSubscriberInList = async (list, subId) => {
    const ids = list.subscriber_ids || [];
    const updated = ids.includes(subId) ? ids.filter(i => i !== subId) : [...ids, subId];
    await base44.entities.ContactList.update(list.id, { subscriber_ids: updated });
    fetchData();
  };

  const useTemplate = (tmpl) => {
    setCampaign({ name: tmpl.name, subject: tmpl.subject, body_html: tmpl.body_html.trim(), category: tmpl.category });
    setPreviewTemplate(null);
    showToast('Template loaded into composer!');
  };

  const saveCampaign = async (e) => {
    e.preventDefault();
    setSavingCampaign(true);
    await base44.entities.EmailCampaign.create({
      name: campaign.name,
      subject: campaign.subject,
      body_html: campaign.body_html,
      category: campaign.category,
      sender_email: campaign.sender_email,
      sender_name: campaign.sender_name,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduled_at: scheduledAt || undefined,
      contact_list_id: campaign.recipient_mode === 'list' ? (campaign.contact_list_id || undefined) : undefined,
      manual_emails: campaign.recipient_mode === 'manual' ? campaign.manual_emails : undefined,
    });
    showToast(scheduledAt ? 'Campaign scheduled!' : 'Campaign saved as draft!');
    setCampaign({ name: '', subject: '', body_html: '', category: '', sender_email: 'noreply@mail.taperpayer.com', sender_name: 'Taper Payer', contact_list_id: '', recipient_mode: 'list', manual_emails: '' });
    setScheduledAt('');
    fetchData();
    setSavingCampaign(false);
  };

  const sendCampaign = async (id) => {
    setSendingId(id);
    try {
      const res = await base44.functions.invoke('sendEmailBlast', { campaign_id: id });
      if (res.data?.success) {
        showToast(`✅ Sent to ${res.data.sent_count} subscribers!`);
      } else {
        showToast(res.data?.error || 'Failed to send.', 'error');
      }
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to send campaign.', 'error');
    }
    setSendingId(null);
    fetchData();
  };

  const deleteCampaign = async (id) => {
    await base44.entities.EmailCampaign.delete(id);
    showToast('Campaign deleted.');
    fetchData();
  };

  const activeCount = subscribers.filter(s => s.status === 'active').length;
  const filteredTemplates = templateCategory === 'All'
    ? EMAIL_TEMPLATES
    : EMAIL_TEMPLATES.filter(t => t.category === templateCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-bold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-sm text-gray-500">{previewTemplate.subject}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => useTemplate(previewTemplate)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Use Template
                </Button>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <iframe
                srcDoc={previewTemplate.body_html}
                title="Email Preview"
                className="w-full border rounded-lg"
                style={{ height: '500px' }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
              <p className="text-gray-500 text-sm">{activeCount} active subscribers</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">{activeCount}</div>
            <div className="text-sm text-gray-500 mt-1">Active Subscribers</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-green-600">{campaigns.filter(c => c.status === 'sent').length}</div>
            <div className="text-sm text-gray-500 mt-1">Sent</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-blue-500">{campaigns.filter(c => c.status === 'scheduled').length}</div>
            <div className="text-sm text-gray-500 mt-1">Scheduled</div>
          </Card>
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-orange-500">{campaigns.filter(c => c.status === 'draft').length}</div>
            <div className="text-sm text-gray-500 mt-1">Drafts</div>
          </Card>
        </div>

        <Tabs defaultValue="campaigns">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates" className="gap-1"><Sparkles className="w-3.5 h-3.5" /> Templates</TabsTrigger>
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="lists" className="gap-1"><List className="w-3.5 h-3.5" /> Contact Lists</TabsTrigger>
            <TabsTrigger value="import">Bulk Import</TabsTrigger>
          </TabsList>

          {/* CAMPAIGNS TAB */}
          <TabsContent value="campaigns">
            <div className="space-y-4">
              {campaignsLoading && <Card className="p-10 text-center text-gray-400">Loading campaigns...</Card>}
              {campaigns.length === 0 && !campaignsLoading && (
                <Card className="p-10 text-center text-gray-400">No campaigns yet. Start from a template or compose from scratch.</Card>
              )}
              {campaigns.map(c => (
                <Card key={c.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900">{c.name}</span>
                      <Badge className={statusBadge[c.status] || 'bg-gray-100 text-gray-600'}>
                        {c.status}
                      </Badge>
                      {c.category && <Badge className="bg-purple-100 text-purple-700 text-xs">{c.category}</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{c.subject}</p>
                    {c.status === 'sent' && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {c.sent_count} emails sent · {c.sent_at ? new Date(c.sent_at).toLocaleDateString() : ''}
                      </p>
                    )}
                    {c.status === 'scheduled' && c.scheduled_at && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Scheduled: {new Date(c.scheduled_at).toLocaleString()}
                      </p>
                    )}
                    {c.status === 'draft' && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Draft</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(c.status === 'draft' || c.status === 'scheduled') && (
                      <Button size="sm" onClick={() => sendCampaign(c.id)} disabled={sendingId === c.id} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Send className="w-4 h-4 mr-1" />
                        {sendingId === c.id ? 'Sending...' : 'Send Now'}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteCampaign(c.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="templates">
            <div className="mb-5 flex gap-2 flex-wrap">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setTemplateCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${templateCategory === cat ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(tmpl => (
                <Card key={tmpl.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className="bg-purple-100 text-purple-700 text-xs mb-2">{tmpl.category}</Badge>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{tmpl.name}</h3>
                    </div>
                    <FileText className="w-5 h-5 text-gray-300 flex-shrink-0 ml-2 mt-1" />
                  </div>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{tmpl.subject}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(tmpl)} className="flex-1 gap-1 text-xs">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </Button>
                    <Button size="sm" onClick={() => useTemplate(tmpl)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1">
                      <Plus className="w-3.5 h-3.5" /> Use
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* COMPOSE TAB */}
          <TabsContent value="compose">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Compose Email Campaign</h2>
              {campaign.body_html && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
                  <Sparkles className="w-4 h-4" /> Template loaded: <strong>{campaign.name}</strong>
                  <button onClick={() => setCampaign({ name: '', subject: '', body_html: '', category: '' })} className="ml-auto text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
                </div>
              )}
              <form onSubmit={saveCampaign} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                    <Input value={campaign.name} onChange={e => setCampaign({...campaign, name: e.target.value})} placeholder="e.g. March Newsletter" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Input value={campaign.category} onChange={e => setCampaign({...campaign, category: e.target.value})} placeholder="e.g. Money Transfer, Mobile Top-Up" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
                    <Input value={campaign.sender_name} onChange={e => setCampaign({...campaign, sender_name: e.target.value})} placeholder="e.g. Taper Payer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
                    <Input type="email" value={campaign.sender_email} onChange={e => setCampaign({...campaign, sender_email: e.target.value})} placeholder="e.g. marketing@taperpayer.com" />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to use default noreply address.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setCampaign({...campaign, recipient_mode: 'list', manual_emails: ''})}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${(!campaign.recipient_mode || campaign.recipient_mode === 'list') ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                      Contact List
                    </button>
                    <button
                      type="button"
                      onClick={() => setCampaign({...campaign, recipient_mode: 'manual', contact_list_id: ''})}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${campaign.recipient_mode === 'manual' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                      Paste Emails Manually
                    </button>
                  </div>
                  {(!campaign.recipient_mode || campaign.recipient_mode === 'list') ? (
                    <select
                      value={campaign.contact_list_id}
                      onChange={e => setCampaign({...campaign, contact_list_id: e.target.value})}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="">All Active Subscribers</option>
                      {contactLists.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({(l.subscriber_ids || []).length} contacts)</option>
                      ))}
                    </select>
                  ) : (
                    <div>
                      <Textarea
                        value={campaign.manual_emails || ''}
                        onChange={e => setCampaign({...campaign, manual_emails: e.target.value})}
                        placeholder={"john@example.com\njane@example.com, Jane Doe\nbob@example.com"}
                        className="min-h-28 font-mono text-sm"
                      />
                      <p className="text-xs text-gray-400 mt-1">One email per line. Optionally add a name: <code className="bg-gray-100 px-1 rounded">email, Name</code></p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                  <Input value={campaign.subject} onChange={e => setCampaign({...campaign, subject: e.target.value})} placeholder="e.g. 🚀 New Features from Taper Payer!" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Body (HTML)</label>
                  <Textarea
                    value={campaign.body_html}
                    onChange={e => setCampaign({...campaign, body_html: e.target.value})}
                    placeholder="<h1>Hello!</h1><p>Your message here...</p>"
                    className="min-h-64 font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Tip: Load a template from the Templates tab to get a head start.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Schedule Send (optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave empty to save as draft and send manually.</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button type="submit" disabled={savingCampaign} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {scheduledAt ? <><Calendar className="w-4 h-4 mr-1" />{savingCampaign ? 'Scheduling...' : 'Schedule Campaign'}</> : <><Plus className="w-4 h-4 mr-1" />{savingCampaign ? 'Saving...' : 'Save as Draft'}</>}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          {/* SUBSCRIBERS TAB */}
          <TabsContent value="subscribers">
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Add Subscriber</h2>
              <form onSubmit={addSubscriber} className="flex gap-3 flex-wrap">
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address *" className="flex-1 min-w-48" required />
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (optional)" className="flex-1 min-w-36" />
                <Input value={newTags} onChange={e => setNewTags(e.target.value)} placeholder="Tags (comma-separated)" className="flex-1 min-w-36" />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </form>
            </Card>
            <Card className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">All Subscribers ({subscribers.length})</h2>
              {loading && <p className="text-gray-400 text-center py-8">Loading...</p>}
              <div className="divide-y">
                {subscribers.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{sub.email}</span>
                        {sub.name && <span className="text-gray-500 text-sm">· {sub.name}</span>}
                        <Badge className={sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>{sub.status}</Badge>
                        {sub.tags?.map(tag => <Badge key={tag} className="bg-blue-100 text-blue-600 text-xs">{tag}</Badge>)}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {sub.status === 'active' && (
                        <Button size="sm" variant="ghost" onClick={() => unsubscribe(sub.id)} className="text-orange-400 hover:text-orange-600 text-xs">Unsub</Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => removeSubscriber(sub.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {subscribers.length === 0 && !loading && <p className="text-gray-400 text-center py-8">No subscribers yet.</p>}
              </div>
            </Card>
          </TabsContent>

          {/* CONTACT LISTS TAB */}
          <TabsContent value="lists">
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Create Contact List</h2>
              <form onSubmit={createContactList} className="flex gap-3 flex-wrap">
                <Input value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="List name *" className="flex-1 min-w-48" required />
                <Input value={newListDesc} onChange={e => setNewListDesc(e.target.value)} placeholder="Description (optional)" className="flex-1 min-w-48" />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-1" /> Create List
                </Button>
              </form>
            </Card>
            <div className="space-y-4">
              {contactLists.length === 0 && <Card className="p-10 text-center text-gray-400">No contact lists yet. Create one above.</Card>}
              {contactLists.map(list => (
                <Card key={list.id} className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{list.name}</h3>
                      {list.description && <p className="text-sm text-gray-500">{list.description}</p>}
                      <p className="text-xs text-blue-600 mt-1">{(list.subscriber_ids || []).length} contacts</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingList(editingList?.id === list.id ? null : list)} className="gap-1 text-xs">
                        <Pencil className="w-3.5 h-3.5" /> {editingList?.id === list.id ? 'Close' : 'Manage'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteContactList(list.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {editingList?.id === list.id && (
                    <div className="border-t pt-4">
                      <Input
                        value={listSubscriberSearch}
                        onChange={e => setListSubscriberSearch(e.target.value)}
                        placeholder="Search subscribers..."
                        className="mb-3"
                      />
                      <div className="max-h-64 overflow-y-auto divide-y">
                        {subscribers
                          .filter(s => s.status === 'active' && (
                            !listSubscriberSearch ||
                            s.email.toLowerCase().includes(listSubscriberSearch.toLowerCase()) ||
                            (s.name && s.name.toLowerCase().includes(listSubscriberSearch.toLowerCase()))
                          ))
                          .map(sub => {
                            const inList = (list.subscriber_ids || []).includes(sub.id);
                            return (
                              <div key={sub.id} className="flex items-center justify-between py-2 gap-3">
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                                  {sub.name && <span className="text-xs text-gray-400 ml-2">{sub.name}</span>}
                                </div>
                                <Button
                                  size="sm"
                                  variant={inList ? 'default' : 'outline'}
                                  onClick={() => toggleSubscriberInList(list, sub.id)}
                                  className={`text-xs flex-shrink-0 ${inList ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                                >
                                  {inList ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Added</> : <><Plus className="w-3 h-3 mr-1" /> Add</>}
                                </Button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* BULK IMPORT TAB */}
          <TabsContent value="import">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Bulk Import Subscribers</h2>
              <p className="text-sm text-gray-500 mb-4">One email per line. Optionally add a name separated by a comma: <code className="bg-gray-100 px-1 rounded">email@example.com, John Doe</code></p>
              <Textarea
                value={bulkEmails}
                onChange={e => setBulkEmails(e.target.value)}
                placeholder={"john@example.com, John Doe\njane@example.com\nbob@example.com, Bob Smith"}
                className="min-h-48 font-mono text-sm mb-4"
              />
              <div className="flex gap-3 flex-wrap">
                <Button onClick={bulkImport} disabled={importing} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="w-4 h-4 mr-2" /> {importing ? 'Importing...' : 'Import Subscribers'}
                </Button>
                <Button onClick={deduplicateSubscribers} disabled={deduplicating} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" /> {deduplicating ? 'Removing Duplicates...' : 'Remove Duplicates'}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}