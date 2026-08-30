import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if configured
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export { doc, getDoc, setDoc, onSnapshot };
