import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, Messaging, getToken } from 'firebase/messaging';

const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

const config = {
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
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const messaging: Messaging = getMessaging(firebaseApp);

getToken(messaging, { vapidKey: 'BIthTVqq3HhrXEbu5aD_Vt143-VV4YmuSVeZDg9g71Rl4wWBqYIIUm1tKpjz0bDiH8ZuT3DU3Jg47aaIRIhA_l8' }).then((currentToken) => {
  if (currentToken) {
    console.log('🚀 ~ currentToken', currentToken)
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

export { config, auth, firestore };