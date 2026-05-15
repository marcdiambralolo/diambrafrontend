import config from '@/lib/config';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export interface AnalysisStatusPayload {
  status: string;
  [key: string]: unknown;
}

export function useAnalysisSocket(
  consultationId: string,
  onStatus: (status: string, payload: AnalysisStatusPayload) => void
) {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!consultationId) return;

    const getWebSocketUrl = (): string => {
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (isProduction && typeof window !== 'undefined') {
        // En production, utiliser le même domaine que le frontend
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}`;
      }
      
      // En développement, utiliser localhost:3001
      const baseURL = config.api.baseURL;
      if (typeof window !== 'undefined') {
        if (baseURL.includes('localhost')) {
          return window.location.protocol === 'https:'
            ? 'wss://localhost:3001'
            : 'ws://localhost:3001';
        }
        return baseURL.replace(/^http(s?):\/\//, window.location.protocol === 'https:' ? 'wss://' : 'ws://');
      }
      
      return 'ws://localhost:3001';
    };

    const wsUrl = getWebSocketUrl();
    
    if (!socket) {
      socket = io(wsUrl, {
        transports: ['websocket'],
        path: '/socket.io',
        withCredentials: true,
      });
    }

    const event = `analysis:status:${consultationId}`;
    const handler = (data: AnalysisStatusPayload) => {
      if (isMounted.current) {
        onStatus(data.status, data);
      }
    };

    if (socket) {
      socket.on(event, handler);
    }
    
    return () => {
      if (socket) {
        socket.off(event, handler);
      }
    };
  }, [consultationId, onStatus]);
}