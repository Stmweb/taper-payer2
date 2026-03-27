import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Trash2, Shield, Bell, Moon, Sun, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MobileHeader from '@/components/mobile/MobileHeader';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AccountSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setFormData({
          full_name: currentUser?.full_name || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || ''
        });
      } catch (e) {
        console.error('Failed to load user:', e);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    // Only redirect if landed on root path without intention
    if (window.location.pathname === '/') {
      navigate('/TaperPayerHome', { replace: true });
    }
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout('/TaperPayerHome');
  };

  const handleSaveField = async (field) => {
    try {
      await base44.auth.updateMe({ [field === 'full_name' ? 'full_name' : field]: formData[field] });
      setUser({ ...user, [field]: formData[field] });
      setEditingField(null);
      toast.success('Profile updated successfully');
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };

  const [darkMode, setDarkMode] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteStatus(null);
    try {
      const user = await base44.auth.me();
      if (!user) {
        toast.error('Please log in to delete your account');
        setIsDeleting(false);
        return;
      }

      // Send deletion request email to admin
      await base44.functions.invoke('sendInquiryEmail', {
        name: user.full_name || 'User',
        email: user.email,
        subject: `Account Deletion Request - ${user.email}`,
        message: `I request to delete my account and all associated data.\n\nEmail: ${user.email}\nName: ${user.full_name || 'N/A'}\n\nPlease process this deletion request as soon as possible.`
      });

      setDeleteStatus('success');
      toast.success('Deletion request sent. Check your email for confirmation.');
    } catch (error) {
      toast.error('Failed to send deletion request');
      setDeleteStatus('error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-20 md:pb-0">
      <MobileHeader title="My Account" showBack={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Section */}
          <Card className="p-4 sm:p-6 dark:bg-slate-800 dark:border-gray-700 border-0 sm:border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Profile</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-xl border border-blue-100 dark:border-slate-600">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Full Name</p>
                  {editingField === 'full_name' ? (
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full h-10 sm:h-9 text-base dark:bg-slate-600 dark:text-white border-blue-300"
                      autoFocus
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-base sm:text-sm font-semibold dark:text-white truncate">{user?.full_name || 'Not set'}</p>
                  )}
                </div>
                {editingField === 'full_name' ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button size="sm" onClick={() => handleSaveField('full_name')} className="flex-1 sm:flex-none">Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingField(null)} className="flex-1 sm:flex-none">Cancel</Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setEditingField('full_name')} className="w-full sm:w-auto dark:text-gray-300 text-blue-600 font-semibold">
                    Edit
                  </Button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-green-50 dark:bg-slate-700/50 rounded-xl border border-green-100 dark:border-slate-600">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Email Address</p>
                  <p className="text-base sm:text-sm font-semibold dark:text-white break-all">{user?.email || 'Not set'}</p>
                </div>
                <Button variant="ghost" size="sm" disabled className="w-full sm:w-auto dark:text-gray-300 opacity-50 cursor-not-allowed text-gray-500">
                  Read-only
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-orange-50 dark:bg-slate-700/50 rounded-xl border border-orange-100 dark:border-slate-600">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Phone Number</p>
                  {editingField === 'phone' ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-10 sm:h-9 text-base dark:bg-slate-600 dark:text-white border-orange-300"
                      autoFocus
                      placeholder="Enter your phone"
                    />
                  ) : (
                    <p className="text-base sm:text-sm font-semibold dark:text-white">{user?.phone || 'Not set'}</p>
                  )}
                </div>
                {editingField === 'phone' ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button size="sm" onClick={() => handleSaveField('phone')} className="flex-1 sm:flex-none">Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingField(null)} className="flex-1 sm:flex-none">Cancel</Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setEditingField('phone')} className="w-full sm:w-auto dark:text-gray-300 text-orange-600 font-semibold">
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="p-4 sm:p-6 dark:bg-slate-800 dark:border-gray-700 border-0 sm:border shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  {darkMode ? (
                    <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sun className="w-6 h-6 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-semibold dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {darkMode ? 'Currently enabled' : 'Currently disabled'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={toggleDarkMode}
                  className="dark:border-gray-600 dark:text-gray-300"
                  style={{ userSelect: 'none' }}
                >
                  Toggle
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="font-semibold dark:text-white">Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your notification preferences</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300" style={{ userSelect: 'none' }}>
                  Manage
                </Button>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-4 sm:p-6 dark:bg-slate-800 dark:border-gray-700 border-0 sm:border shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold dark:text-white">Password</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Change your password</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300" style={{ userSelect: 'none' }}>
                  Change
                </Button>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-4 sm:p-6 border-red-200 dark:bg-slate-800 dark:border-red-900 border-0 sm:border shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            {deleteStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 text-sm">
                Deletion request sent successfully. You will receive a confirmation email shortly.
              </div>
            )}
            {deleteStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                Failed to send deletion request. Please contact support directly.
              </div>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full sm:w-auto"
                  disabled={isDeleting || deleteStatus === 'success'}
                  style={{ userSelect: 'none' }}
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  {isDeleting ? 'Processing…' : 'Delete Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark:bg-slate-800 dark:border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="dark:text-gray-400">
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:bg-slate-700 dark:text-gray-300 dark:border-gray-600" style={{ userSelect: 'none' }}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                    style={{ userSelect: 'none' }}
                  >
                    {isDeleting ? 'Sending Request...' : 'Yes, delete my account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>

          {/* Logout */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleLogout}
              className="flex-1 h-11 sm:h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Logout
            </Button>
            <Link to={createPageUrl('TaperPayerHome')} className="flex-1">
              <Button variant="outline" className="w-full h-11 sm:h-10 font-semibold">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}