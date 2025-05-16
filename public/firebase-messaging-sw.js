// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: 'AIzaSyAxlSjz8igOSPHP94EeUEAwsk-1WnVzyDs',
  authDomain: 'thelocalmarketshop-f7c4c.firebaseapp.com',
  projectId: 'thelocalmarketshop-f7c4c',
  messagingSenderId: '457786813395',
  appId: '1:457786813395:web:41d1d371fdbd46c9c15d26',
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});

