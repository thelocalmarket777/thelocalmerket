// src/hooks/useFcmToken.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { messaging } from "../firebaseConfig";

export function useFcmToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const askPermission = async () => {
      const permission = Notification.permission;
      if (permission === "granted") {
        return true;
      }
      if (permission === "default") {
        const result = await Notification.requestPermission();
        return result === "granted";
      }
      // permission === "denied"
      toast.error("Please enable notifications in your browser settings.");
      return false;
    };

    askPermission().then((granted) => {
      if (!granted) return;
      getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY! })
        .then((t) => {
          if (t) {
            setToken(t);
            axios.post(
              "http://127.0.0.1:8000/api/notifications/register/",
              { token: t },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
          }
        })
        .catch(console.error);
    });

    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title && body) {
        toast.success(`${title}: ${body}`);
      }
    });
  }, []);

  return token;
}
