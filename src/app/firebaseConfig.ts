import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

export const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'project-tracker-620a6.firebaseapp.com',
  databaseURL: 'https://project-tracker-620a6-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'project-tracker-620a6',
  storageBucket: 'project-tracker-620a6.appspot.com',
  messagingSenderId: '729759911657',
  appId: '1:729759911657:web:3724a6adad99bfebc46a78',
};

// Initialize Firebase
const firebaseApp: FirebaseApp = initializeApp(config);
export const auth = getAuth(firebaseApp);
