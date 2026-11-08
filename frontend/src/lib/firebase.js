import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "drive-ea030.firebaseapp.com",
  projectId: "drive-ea030",
  storageBucket: "drive-ea030.firebasestorage.app",
  messagingSenderId: "723417858425",
  appId: "1:723417858425:web:6f92b404ba9f6cc952efa8",
  measurementId: "G-68MWDZM7KT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const google_provider = new GoogleAuthProvider()
