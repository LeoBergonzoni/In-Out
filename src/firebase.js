// firebase.js

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Configurazione Firebase tramite variabili d'ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// 🚀 Inizializza Firebase
const app = initializeApp(firebaseConfig);

// 🧠 Inizializza Auth
const auth = getAuth(app);

// ✍️ Imposta la persistenza locale (importante per Capacitor iOS)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("🔐 Persistenza attivata (browserLocalPersistence)");
  })
  .catch((error) => {
    console.error("⚠️ Errore impostando la persistenza:", error.message);
  });

// 📦 Provider Google (se ti servirà in futuro)
const googleProvider = new GoogleAuthProvider();

// 🔥 Inizializza Firestore
const db = getFirestore(app);

// 🧾 Esporta tutto
export { auth, googleProvider, db };