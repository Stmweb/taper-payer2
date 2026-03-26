import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Mail, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/mobile/MobileHeader';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DeleteDataAndAccount() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await base44.functions.invoke('sendInquiryEmail', {
        name: formData.name,
        email: formData.email,
        subject: `GDPR/CCPA Data & Account Deletion Request - ${formData.email}`,
        message: `I request to delete my account and all associated data from Taper Payer.\n\nName: ${formData.name}\nEmail: ${formData.email}\nReason: ${formData.reason}\n\nAdditional Information:\n${formData.additionalInfo || 'N/A'}\n\nPlease process this deletion request within 30 days as required by GDPR/CCPA regulations.`
      });

      setSubmitStatus('success');
      toast.success('Deletion request sent successfully. Check your email for confirmation.');
      setFormData({ name: '', email: '', reason: '', additionalInfo: '' });
    } catch (error) {
      setSubmitStatus('error');
      toast.error('Failed to send deletion request. Please contact support directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 pb-20 md:pb-0">
      <MobileHeader title="Delete Data & Account" showBack={true} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Warning Banner */}
          <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Important Notice</h2>
                <p className="text-red-700 dark:text-red-400">
                  This action will permanently delete your account and all associated data including transaction history, saved recipients, and personal information. This process cannot be undone.
                </p>
              </div>
            </div>
          </Card>

          {/* Information Card */}
          <Card className="p-6 dark:bg-slate-800 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Your Rights</h2>
            <div className="space-y-3 text-slate-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p>Under GDPR and CCPA regulations, you have the right to request deletion of your personal data.</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p>You will receive a confirmation email once your deletion request is received and processed.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <p>Deletion requests are processed within 30 days as required by law.</p>
              </div>
            </div>
          </Card>

          {/* Deletion Request Form */}
          <Card className="p-6 dark:bg-slate-800 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Deletion Request Form</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300">Request Submitted Successfully</p>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      We've sent a confirmation email to {formData.email}. Your request will be processed within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-400">
                  Failed to submit request. Please contact support@taperpayer.com directly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Reason for Deletion *
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="">Select a reason</option>
                  <option value="No longer using the service">No longer using the service</option>
                  <option value="Privacy concerns">Privacy concerns</option>
                  <option value="Found alternative service">Found alternative service</option>
                  <option value="Account security concerns">Account security concerns</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Additional Information (Optional)
                </label>
                <Textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="w-full min-h-[100px]"
                  placeholder="Any additional details you'd like to share..."
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full"
                  disabled={isSubmitting}
                  size="lg"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Submitting Request...' : 'Submit Deletion Request'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Alternative Contact */}
          <Card className="p-6 dark:bg-slate-800 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Need Help?</h3>
            <p className="text-slate-600 dark:text-gray-400 mb-4">
              If you have questions about the deletion process or need immediate assistance, contact our support team:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-slate-700 dark:text-gray-300">
                <strong>Email:</strong> support@taperpayer.com
              </p>
              <p className="text-slate-700 dark:text-gray-300">
                <strong>Phone:</strong> 404-994-0766
              </p>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="text-center pt-4">
            <Link to="/TaperPayerHome" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}