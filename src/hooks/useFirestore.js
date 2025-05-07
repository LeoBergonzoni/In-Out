import { useEffect, useState } from "react";

const mockData = [
  {
    id: "1",
    date: "2025-04-01",
    amount: -15.5,
    description: "Spesa supermercato",
    type: "Spesa",
    category: "Sopravvivenza"
  },
  {
    id: "2",
    date: "2025-04-02",
    amount: 1000,
    description: "Stipendio",
    type: "Entrata",
    category: "Extra"
  }
];

export const useFirestore = (uid) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula caricamento dati per 500ms
    if (uid === "test-mode") {
      setTimeout(() => {
        setEntries(mockData);
        setLoading(false);
      }, 500);
    } else {
      // fallback se serve altro
      setEntries([]);
      setLoading(false);
    }
  }, [uid]);

  const addEntry = async (entry) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const updateEntry = async (id, updated) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteEntry = async (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return { entries, addEntry, updateEntry, deleteEntry, loading };
};