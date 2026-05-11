import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useMessagingSocket(conversationId: string, onMessage: (msg: any) => void, token?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('/ws-messaging', {
      auth: { token },
    });
    socketRef.current = socket;
    if (conversationId) {
      socket.emit('join-conversation', conversationId);
    }
    socket.on('new-message', onMessage);

    return () => {
      if (conversationId) {
        socket.emit('leave-conversation', conversationId);
      }
      socket.off('new-message', onMessage);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, token]);

  return socketRef;
}