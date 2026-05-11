import config from '@/lib/config';
import { useEffect } from 'react';
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
  useEffect(() => {
    if (!consultationId) return;
    if (!socket) {
      // Toujours utiliser le domaine public en production
      const baseURL = config.api.baseURL;
      if (typeof window !== 'undefined') {
        let wsURL = '';
        if (baseURL.includes('localhost')) {
          // Force le port 3001 pour le backend local
          wsURL = window.location.protocol === 'https:'
            ? 'wss://localhost:3001'
            : 'ws://localhost:3001';
        } else {
          wsURL = baseURL.replace(/^http(s?):\/\//, window.location.protocol === 'https:' ? 'wss://' : 'ws://');
        }
        socket = io(wsURL, {
          transports: ['websocket'],
        });
      }
    }
    const event = `analysis:status:${consultationId}`;
    const handler = (data: AnalysisStatusPayload) => {
      onStatus(data.status, data);
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
