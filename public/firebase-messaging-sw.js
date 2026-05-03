importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCGOA3TkrDXDiOxvJbdbnzay6dBeGgwUKE",
  authDomain: "taper-payer.firebaseapp.com",
  projectId: "taper-payer",
  storageBucket: "taper-payer.firebasestorage.app",
  messagingSenderId: "1094034931601",
  appId: "1:1094034931601:web:7cd4cd7491995bf7eda430",
};

firebase.initializeApp(FIREBASE_CONFIG);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Taper Payer', {
    body: body || '',
    icon: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png',
    badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6939bfcca75c45675d6c793f/d7d75e226_ChatGPTImageDec29202501_48_52PM.png',
    data: payload.data || {},
  });
});
