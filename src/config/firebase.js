import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB5dXL-LIcbjh9QXliSuK7B5tpflT4Swx0",
  authDomain: "cabinet-seujet-83d5d.firebaseapp.com",
  projectId: "cabinet-seujet-83d5d",
  storageBucket: "cabinet-seujet-83d5d.firebasestorage.app",
  messagingSenderId: "1055279621858",
  appId: "1:1055279621858:web:0075b03ab1995c9e07e0bb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;