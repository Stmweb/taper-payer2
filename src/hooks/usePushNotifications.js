import { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// ⚠️ Replace these with your actual Firebase web app config values
// from Firebase Console → Project Settings → Your apps → Web app
const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

// Your VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = "YOUR_VAPID_KEY";

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