import { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { base44 } from '@/api/base44Client';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCGOA3TkrDXDiOxvJbdbnzay6dBeGgwUKE",
  authDomain: "taper-payer.firebaseapp.com",
  projectId: "taper-payer",
  storageBucket: "taper-payer.firebasestorage.app",
  messagingSenderId: "1094034931601",
  appId: "1:1094034931601:web:7cd4cd7491995bf7eda430",
};

// Your VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
// ⚠️ Replace with your actual VAPID key
const VAPID_KEY = "BE4euAW-XoTB_vU_Z4Sn1T-tsZXDn9PolGazPwdgM9pPlnW0XFw_QYL8zCVmGQRsr1Ve05-Y0NlfzUONrCut4ik";

let firebaseApp = null;
let messaging = null;

function initFirebase() {
  if (!firebaseApp) {
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  }
  if (!messaging && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      messaging = getMessaging(firebaseApp);
    } catch (e) {
      console.warn('Firebase messaging init failed:', e);
    }
  }
  return { firebaseApp, messaging };
}

export function usePushNotifications() {
  const [fcmToken, setFcmToken] = useState(() => localStorage.getItem('fcm_token'));
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
    setIsSupported(supported);
    if (supported) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return null;

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission !== 'granted') return null;

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      // Send config to SW
      if (registration.active) {
        registration.active.postMessage({ type: 'FIREBASE_CONFIG', config: FIREBASE_CONFIG });
      }

      const { messaging: msg } = initFirebase();
      if (!msg) return null;

      const token = await getToken(msg, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        setFcmToken(token);
        localStorage.setItem('fcm_token', token);
        // Save token to user's AppUser record so admin can send targeted notifications
        try {
          const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user'))?.id : null;
          if (userId) {
            await base44.asServiceRole.entities.AppUser.update(userId, { fcm_token: token });
          }
        } catch (e) {
          // silently ignore
        }
        return token;
      }
    } catch (err) {
      console.error('Push notification setup failed:', err);
    }
    return null;
  }, [isSupported]);

  // Listen for foreground messages
  useEffect(() => {
    if (!isSupported || permissionStatus !== 'granted') return;
    const { messaging: msg } = initFirebase();
    if (!msg) return;

    const unsubscribe = onMessage(msg, (payload) => {
      const { title, body } = payload.notification || {};
      if (title && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png',
        });
      }
    });

    return unsubscribe;
  }, [isSupported, permissionStatus]);

  return { fcmToken, permissionStatus, isSupported, requestPermission };
}