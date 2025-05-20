// src/hooks/useFcmToken.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { messaging } from "../firebaseConfig";

const API_BASE = "http://127.0.0.1:8000/api/";

export function useFcmToken() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    async function registerAndGetToken() {
      // 1) ask for permission
      let granted = Notification.permission === "granted";
      if (Notification.permission === "default") {
        granted = (await Notification.requestPermission()) === "granted";
      }
      if (!granted) {
        toast.error("Please enable notifications in your browser settings.");
        return;
      }

      try {
        // 2) register *your* SW
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        // 3) get FCM token, *passing* the SW registration
        const token = await getToken(messaging, {
          vapidKey: 'BBjZbHNqKGz-zmRkp1wbYatufLepXQPvY9XEjbeHC9gifadHA1vHsVzmdhBrJwDWdU3OHc0vyGJQrlb9wBUwk6E',
          serviceWorkerRegistration: registration,
        });

        if (!token) return;
        setFcmToken(token);

        // 4) send it to your backend
        await axios.post(
          `${API_BASE}notifications/register/`,
          { token },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (err) {
        console.error("FCM registration error:", err);
      }
    }

    registerAndGetToken();
  }, []);

  // 5) foreground messages (toast + native if you like)
  useEffect(() => {
    if (!fcmToken) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      const { title, body } = payload.notification || {};
      if (title && body) {
        // native
        new Notification(title, { body });
        // in-app toast
        toast.success(`${title}: ${body}`);
      }
    });
    return () => unsubscribe();
  }, [fcmToken,messaging]);

  return fcmToken;
}
