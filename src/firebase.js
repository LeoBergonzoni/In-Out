// firebase.js

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔐 Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBA30wj8q5lvMWNJ43OW99WCRuz1VHwZLU",
  authDomain: "kakebo-live.firebaseapp.com",
  projectId: "kakebo-live",
  storageBucket: "kakebo-live.appspot.com",
  messagingSenderId: "261039249179",
  appId: "1:261039249179:web:fb85327debd01654c2a5be"
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