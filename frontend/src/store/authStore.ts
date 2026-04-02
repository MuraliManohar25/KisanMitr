import { create } from 'zustand';

// Find your User interface in authStore.ts and change to:
interface User {
  id: string;
  username: string;
  email: string;
  farmerName?: string;   // ← add ?
  location?: string;     // ← add ?
  phone?: string;        // ← add ?
  role?: string;         // ← add ?
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

// Load from localStorage on init
const loadAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return { user, token, isAuthenticated: !!(user && token) };
};

export const useAuthStore = create<AuthState>((set) => {
  const initial = loadAuth();
  
  return {
    ...initial,
    isAuthenticated: !!(initial.user && initial.token),
    setAuth: (user, token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    },
    initAuth: () => {
      const auth = loadAuth();
      set(auth);
    },
  };
});

