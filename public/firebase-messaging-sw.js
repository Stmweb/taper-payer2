importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase config will be passed via query params when registering
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const config = event.data.config;
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body, icon, data } = payload.notification || payload.data || {};
      self.registration.showNotification(title || 'Taper Payer', {
        body: body || '',
        icon: icon || '/logo192.png',
        badge: '/logo192.png',
        data: data || {},
        vibrate: [200, 100, 200],
      });
    });
  }
});
