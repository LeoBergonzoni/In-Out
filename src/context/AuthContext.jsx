import { createContext, useContext, useEffect, useState } from "react";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Controlla lo stato utente all'avvio
  useEffect(() => {
    const checkUser = async () => {
      try {
        const result = await FirebaseAuthentication.getCurrentUser();
        setUser(result.user ?? null);
      } catch (err) {
        console.error("Errore controllo utente:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 🔄 Listener cambi stato auth
    const listener = FirebaseAuthentication.addListener(
      "authStateChange",
      (event) => {
        console.log("📌 authStateChange:", event);
        setUser(event.user ?? null);
      }
    );

    return () => listener.remove();
  }, []);

  const logout = async () => {
    await FirebaseAuthentication.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);