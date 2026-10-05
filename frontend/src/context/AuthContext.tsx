import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api.js';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from '../config/firebase.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, phone?: string, city?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoUser: (role: 'citizen' | 'collector' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (getAuthToken()) {
        const userData = await api.getMe();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Failed to restore session:', err);
      removeAuthToken();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Standard Login (Firebase First with Backend Sync)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Try Firebase Authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // Sync with CleanSight backend
        const res = await api.firebaseLogin({
          email: fbUser.email,
          name: fbUser.displayName || email.split('@')[0],
          uid: fbUser.uid,
          avatar: fbUser.photoURL || undefined
        });

        setAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
        return;
      } catch (fbErr: any) {
        // If user is a seeded demo user or Firebase user not yet in Firebase auth, fallback to direct backend login
        const res = await api.login({ email, password });
        setAuthToken(res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register with Firebase & CleanSight DB
  const register = async (name: string, email: string, password: string, role = 'citizen', phone?: string, city = 'Pune') => {
    setIsLoading(true);
    try {
      let uid = '';
      let avatar = '';

      // Create in Firebase Authentication
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;
        uid = fbUser.uid;
        avatar = fbUser.photoURL || '';

        await updateProfile(fbUser, { displayName: name });
      } catch (fbErr: any) {
        console.warn('Firebase registration notice (falling back to direct backend):', fbErr.message);
      }

      // Sync/Create in CleanSight backend database with roles & 50 welcome points
      const res = await api.firebaseLogin({
        email,
        name,
        uid,
        avatar,
        role,
        phone,
        city
      });

      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  // Google 1-Click Authentication via Firebase
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const res = await api.firebaseLogin({
        email: fbUser.email,
        name: fbUser.displayName || 'Google Citizen',
        uid: fbUser.uid,
        avatar: fbUser.photoURL || undefined,
        role: 'citizen'
      });

      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase Password Reset Email
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Demo user quick-switch
  const switchDemoUser = async (role: 'citizen' | 'collector' | 'admin') => {
    const creds = {
      citizen: { email: 'citizen@cleansight.org', password: 'citizen123' },
      collector: { email: 'collector@cleansight.org', password: 'collector123' },
      admin: { email: 'admin@cleansight.org', password: 'admin123' }
    };

    const target = creds[role];
    setIsLoading(true);
    try {
      const res = await api.login({ email: target.email, password: target.password });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
        switchDemoUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
