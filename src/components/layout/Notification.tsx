import { useFcmToken } from "@/hooks/useFcmToken";
import React, { FC } from "react";


const NotificationListener: FC = () => {
  useFcmToken();
  return null;
};

export default NotificationListener;
