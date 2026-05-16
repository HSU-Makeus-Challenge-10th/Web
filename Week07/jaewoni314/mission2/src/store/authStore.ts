import { create } from 'zustand';
import { type User } from '../types/auth/user';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  logout: () => {
    set({ user: null, isLoggedIn: false });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
}));
