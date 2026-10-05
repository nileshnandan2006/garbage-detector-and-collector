import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Auth
} from 'firebase/auth';

// Firebase Configuration loaded from Vite Environment Variables with production fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAC0tzZme5H_B12pSqD0Q_E0Y89tAxUPcE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "series-942f9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "series-942f9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "series-942f9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "459831912379",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:459831912379:web:13a11ec7d8ff8a6bf0869e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YTVT2G7XZQ"
};

// Initialize Firebase App safely as singleton
let app: FirebaseApp;
let auth: Auth;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} catch (err) {
  console.warn('Firebase initialization warning (fallback active):', err);
  app = (getApps().length > 0 ? getApp() : {}) as FirebaseApp;
  try {
    auth = getAuth(app);
  } catch {
    auth = {} as Auth;
  }
}

export { app, auth };
export const googleProvider = new GoogleAuthProvider();

// Export auth helper methods
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type FirebaseUser
};

