// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
console.log('process.env.FIREBASE_API_KEY', process.env.FIREBASE_API_KEY)
export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

export const firebaseApp = initializeApp(firebaseConfig);