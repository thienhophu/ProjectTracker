import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBS6166B-IVmVXzPfdP7UOzAVr8DF6p748",
  authDomain: "project-tracker-620a6.firebaseapp.com",
  projectId: "project-tracker-620a6",
  storageBucket: "project-tracker-620a6.appspot.com",
  messagingSenderId: "729759911657",
  appId: "1:729759911657:web:3724a6adad99bfebc46a78",
  databaseURL: "https://project-tracker-620a6-default-rtdb.asia-southeast1.firebasedatabase.app/", // Realtime Database
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
