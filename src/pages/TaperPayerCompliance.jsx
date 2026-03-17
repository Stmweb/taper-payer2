import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Upload, CheckCircle, FileText, AlertCircle, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import SiteFooter from '@/components/SiteFooter';
import TaperPayerLogo from '@/components/taperpayer/TaperPayerLogo';

const DOC_TYPES = [
  { id: 'government_id', label: 'Government-Issued ID', description: 'Passport, Driver\'s License, or National ID', required: true },
  { id: 'proof_of_address', label: 'Proof of Address', description: 'Utility bill, bank statement (within 3 months)', required: true },
  { id: 'source_of_funds', label: 'Source of Funds', description: 'Pay stubs, bank statements, or business documents', required: false },
  { id: 'selfie_with_id', label: 'Selfie with ID', description: 'Clear photo of yourself holding your ID', required: false },
];

export default function TaperPayerCompliance() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [uploads, setUploads] = useState({});
  const [uploading, setUploading] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (docId, file) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [docId]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploads(prev => ({ ...prev, [docId]: { name: file.name, url: file_url } }));
    setUploading(prev => ({ ...prev, [docId]: false }));
  };

  const removeFile = (docId) => {
    setUploads(prev => {
      const updated = { ...prev };
      delete updated[docId];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const requiredDocs = DOC_TYPES.filter(d => d.required);
    const missingDocs = requiredDocs.filter(d => !uploads[d.id]);
    if (missingDocs.length > 0) {
      setError(`Please upload all required documents: ${missingDocs.map(d => d.label).join(', ')}`);
      return;
    }
    if (!fullName || !email) {
      setError('Please provide your full name and email address.');
      return;
    }

    setSubmitting(true);

    const docSummary = Object.entries(uploads)
      .map(([id, info]) => {
        const docType = DOC_TYPES.find(d => d.id === id);
        return `${docType?.label}: ${info.url}`;
      })
      .join('\n');

    await base44.integrations.Core.SendEmail({
      to: 'compliance@taperpayer.com',
      subject: `Compliance Document Submission - ${fullName}`,
      body: `New compliance document submission:\n\nFull Name: ${fullName}\nEmail: ${email}\n\nDocuments:\n${docSummary}`,
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
        <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/TaperPayerHome"><TaperPayerLogo height="h-16" /></Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Documents Submitted!</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-8">
              Thank you, <strong>{fullName}</strong>. Your compliance documents have been received and will be reviewed within 1–3 business days. You'll receive a confirmation at <strong>{email}</strong>.
            </p>
            <Link to="/TaperPayerHome">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8">Back to Home</Button>
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <nav className="bg-white dark:bg-slate-900 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/TaperPayerHome"><TaperPayerLogo height="h-16" /></Link>
          <Link to="/TaperPayerAML" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
            ← AML Policy
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-slate-800 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Compliance Verification</h1>
          <p className="text-blue-100 max-w-xl mx-auto">
            Upload your identity and compliance documents securely. All documents are encrypted and handled in accordance with our AML policy.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-12 max-w-2xl flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Full Legal Name *</label>
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="As shown on your ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Email Address *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Document Upload</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">Accepted formats: JPG, PNG, PDF. Max 10MB per file.</p>

            <div className="space-y-4">
              {DOC_TYPES.map(doc => (
                <div key={doc.id} className="border border-gray-200 dark:border-slate-600 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-white text-sm">{doc.label}</span>
                        {doc.required && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Required</span>}
                        {!doc.required && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Optional</span>}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{doc.description}</p>
                    </div>
                  </div>

                  {uploads[doc.id] ? (
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 dark:text-green-400 truncate max-w-[200px]">{uploads[doc.id].name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={uploads[doc.id].url} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
                        </a>
                        <X className="w-4 h-4 text-slate-400 hover:text-red-600 cursor-pointer" onClick={() => removeFile(doc.id)} />
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-slate-500 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                      {uploading[doc.id] ? (
                        <div className="flex items-center gap-2 text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-500">Click to upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={e => handleFileChange(doc.id, e.target.files[0])}
                        disabled={uploading[doc.id]}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-sm text-blue-700 dark:text-blue-300">
            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>By submitting these documents, you confirm they are authentic and accurate. Documents are securely stored and used solely for compliance verification in accordance with our <Link to="/TaperPayerAML" className="underline font-medium">AML Policy</Link>.</p>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
          >
            {submitting ? 'Submitting...' : 'Submit Documents for Review'}
          </Button>
        </form>
      </div>

      <SiteFooter />
    </div>
  );
}