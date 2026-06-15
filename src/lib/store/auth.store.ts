'use client';
import type { User } from '@/lib/interfaces';
import { create } from 'zustand';

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  updateUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  (set) => ({
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
    updateUser: (user) => set((state) => ({ ...state, user })),
  })
);