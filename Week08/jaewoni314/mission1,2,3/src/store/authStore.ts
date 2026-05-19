import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;

  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isLoggedIn: !!localStorage.getItem('accessToken'),

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
    }),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    set({
      user: null,
      isLoggedIn: false,
    });
  },
}));