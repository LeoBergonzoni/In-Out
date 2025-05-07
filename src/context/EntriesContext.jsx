import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const EntriesContext = createContext();

export const EntriesProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Ascolta cambiamenti di autenticazione
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setEntries([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Carica le voci in tempo reale per l'utente loggato
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "users", userId, "entries"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedEntries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(loadedEntries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Aggiunge una voce (ora senza duplicarla localmente)
  const addEntry = async (entry) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, "users", userId, "entries"), entry);
      // ❌ Non aggiorniamo più localmente qui — ci pensa onSnapshot
    } catch (error) {
      console.error("Errore nell'aggiunta dell'entry:", error);
    }
  };

  // Modifica una voce
  const updateEntry = async (id, updated) => {
    if (!userId) return;
    try {
      const ref = doc(db, "users", userId, "entries", id);
      await updateDoc(ref, updated);
      // ❌ Anche qui: non modifichiamo manualmente lo stato
    } catch (error) {
      console.error("Errore nella modifica dell'entry:", error);
    }
  };

  // Elimina una voce
  const deleteEntry = async (id) => {
    if (!userId) return;
    try {
      const ref = doc(db, "users", userId, "entries", id);
      await deleteDoc(ref);
      // ❌ Anche qui: ci pensa onSnapshot a rimuoverla
    } catch (error) {
      console.error("Errore nell'eliminazione dell'entry:", error);
    }
  };

  return (
    <EntriesContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, loading }}>
      {children}
    </EntriesContext.Provider>
  );
};

export const useEntries = () => useContext(EntriesContext);