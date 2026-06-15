import { useRef, useCallback, useEffect } from 'react';

export function useNotificationSound(url: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  // Crée l'élément audio une seule fois
  useEffect(() => {
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new window.Audio(url);
      audioRef.current.preload = 'auto';
    }
  }, [url]);

  useEffect(() => {
    if (typeof window === 'undefined' || !audioRef.current) return;
    if (unlockedRef.current) return;

    const unlock = () => {
      if (!audioRef.current) return;
      audioRef.current.muted = true;
      audioRef.current.play().catch(() => {});
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.muted = false;
      unlockedRef.current = true;
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('click', unlock, true);
    };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('touchstart', unlock, true);
    window.addEventListener('click', unlock, true);
    return () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('touchstart', unlock, true);
      window.removeEventListener('click', unlock, true);
    };
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return play;
}