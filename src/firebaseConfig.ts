// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAxlSjz8igOSPHP94EeUEAwsk-1WnVzyDs",
  authDomain: "thelocalmarketshop-f7c4c.firebaseapp.com",
  projectId: "thelocalmarketshop-f7c4c",
  storageBucket: "thelocalmarketshop-f7c4c.firebasestorage.app",
  messagingSenderId: "457786813395",
  appId: "1:457786813395:web:41d1d371fdbd46c9c15d26",
  measurementId: "G-HW5PPE7ZNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);