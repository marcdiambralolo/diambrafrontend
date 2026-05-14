'use client';
import { create } from 'zustand';
import type { User } from '@/lib/interfaces';

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
    updateUser: (user) => set((state) => ({ ...state, user })),
    logout: () => set({ user: null }),
  })
);