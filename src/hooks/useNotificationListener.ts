import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { messaging } from "../firebaseConfig";

export function useNotificationListener() {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      const { title, body } = payload.notification || {};
      if (title && body) {
        toast.success(`${title}: ${body}`, {
          duration: 5000,
          position: 'top-right'
        });
      }
    });

    return () => unsubscribe();
  }, []);
}
