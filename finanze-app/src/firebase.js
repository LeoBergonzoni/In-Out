import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBA30wj8q5lvMWNJ43OW99WCRuz1VHwZLU",
  authDomain: "kakebo-live.firebaseapp.com",
  projectId: "kakebo-live",
  storageBucket: "kakebo-live.firebasestorage.app",
  messagingSenderId: "261039249179",
  appId: "1:261039249179:web:fb85327debd01654c2a5be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();