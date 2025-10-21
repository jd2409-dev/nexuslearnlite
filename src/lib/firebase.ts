import { initializeApp, getApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1swrHi_Q9O07OfC4nnWgB6WL5b6PXRl4",
  authDomain: "nexuslearnlite-1e9d9.firebaseapp.com",
  projectId: "nexuslearnlite-1e9d9",
  storageBucket: "nexuslearnlite-1e9d9.firebasestorage.app",
  messagingSenderId: "951464659313",
  appId: "1:951464659313:web:cfda2433e4afb1d4a88ed0",
  measurementId: "G-LQRV4YNVVQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
