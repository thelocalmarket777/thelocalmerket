import { useEffect, useState } from 'react';

export const usePermissionRequest = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const checkPermission = () => {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return;
      }

      // Just check current permission without prompting
      setPermission(Notification.permission);
    };

    checkPermission();
  }, []);

  return permission;
};
