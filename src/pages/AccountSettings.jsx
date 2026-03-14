import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Mail, Phone, Trash2, Shield, Bell, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import MobileHeader from '@/components/mobile/MobileHeader';
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

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    setDeleteStatus(null);
    // Optimistic: show immediate feedback
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteStatus('success');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 pb-20 md:pb-0">
      <MobileHeader title="Account Settings" showBack={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Section */}
          <Card className="p-6 dark:bg-slate-800 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-semibold dark:text-white">John Doe</p>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300" style={{ userSelect: 'none' }}>
                  Edit
                </Button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-semibold dark:text-white">john.doe@example.com</p>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300" style={{ userSelect: 'none' }}>
                  Edit
                </Button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <Phone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-semibold dark:text-white">+1 (555) 123-4567</p>
                </div>
                <Button variant="ghost" size="sm" className="dark:text-gray-300" style={{ userSelect: 'none' }}>
                  Edit
                </Button>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="p-6 dark:bg-slate-800 dark:border-gray-700">
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
          <Card className="p-6 dark:bg-slate-800 dark:border-gray-700">
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
          <Card className="p-6 border-red-200 dark:bg-slate-800 dark:border-red-900">
            <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            {deleteStatus === 'success' && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                Account deletion initiated. You will receive a confirmation email.
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
                    style={{ userSelect: 'none' }}
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>

          {/* Back to Home */}
          <div className="text-center pt-4">
            <Link
              to={createPageUrl('TaperPayerHome')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}