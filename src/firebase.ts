import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  memoryLocalCache,
  setLogLevel,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  increment,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Silence internal SDK connection warnings in browser console during offline fallback
try {
  setLogLevel('silent');
} catch {
  // Ignore in environments where setLogLevel is not permitted
}

// Initialize Firebase App safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with memory cache to avoid IndexedDB lock and partition issues in iframes
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: memoryLocalCache(),
    },
    firebaseConfig.firestoreDatabaseId || undefined
  );
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
}

export const db = firestoreInstance;

export {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  setLogLevel,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  increment,
};

