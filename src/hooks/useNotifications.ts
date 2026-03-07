import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const useNotifications = (userId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('accessToken');
    const newSocket = io(SOCKET_URL, {
      query: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to notifications server');
    });

    newSocket.on('notification', (data) => {
      console.log('New notification:', data);
      setNotifications((prev) => [data, ...prev]);
      
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification(data.title, { body: data.message });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const requestPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  return { socket, notifications, requestPermission };
};
