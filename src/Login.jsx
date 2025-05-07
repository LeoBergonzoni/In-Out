import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔍 Test connessione all'avvio
  useEffect(() => {
    console.log("✨ navigator.onLine:", navigator.onLine);
    window.addEventListener("online", () => console.log("📶 Sei tornato online!"));
    window.addEventListener("offline", () => console.log("❌ Sei offline!"));

    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => console.log("✅ Test API online:", res.status))
      .catch((err) => console.error("❌ Errore rete:", err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("📨 Tentativo di login per:", email);

      const result = await FirebaseAuthentication.signInWithEmailAndPassword({
        email,
        password,
      });

      console.log("✅ Login nativo riuscito:", result);
      navigate("/home");
    } catch (err) {
      console.error("❌ Errore login:", err.message || err);
      setError("Errore: " + (err.message || "Impossibile accedere"));
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white font-inout flex items-center justify-center px-4">
      <div className="bg-soft text-navy p-8 rounded-xl shadow w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Accedi a In&Out</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-accent text-white py-2 rounded"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}