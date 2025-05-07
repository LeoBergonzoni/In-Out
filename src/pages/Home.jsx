import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { useEntries } from "../context/EntriesContext";

export default function Home() {
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Spesa");
  const [editingEntry, setEditingEntry] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const scrollRef = useRef(null);

  const { entries, addEntry, updateEntry, deleteEntry } = useEntries();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(scrollRef.current?.scrollTop > 0);
    };

    const node = scrollRef.current;
    if (!node) return;

  node.addEventListener("scroll", handleScroll);

  return () => {
    node.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const categories = {
    Sopravvivenza: ["spesa", "farmacia", "medico", "affitto", "bolletta", "condominio", "trasporto", "benzina", "benza", "parcheggio"],
    Optional: ["bar", "ristorante", "tabacchi", "cosmetica", "shopping", "pranzo", "cena","aperitivo", "apero", "gelato", "amazon"],
    Cultura: ["cinema", "teatro", "libri"],
    Abbonamenti: ["abbonamento"],
    ContoCointestato: ["cointestato"],
    Viaggi: ["treno", "vacanza", "aereo", "albergo", "traghetto"],
    Stipendio: ["stipendio"],
    Fatturato_Incassato: ["pagamento","fattura","cliente"],
    Tasse: ["tasse"],
  };

  const getCategory = (desc) => {
    const lower = desc.toLowerCase();
    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some((k) => lower.includes(k))) return cat;
    }
    return "Extra";
  };

  const handleAdd = () => {
    if (!amount || !description) return;
    const parsed = parseFloat(amount.replace(",", "."));
    const value = type === "Spesa" ? -Math.abs(parsed) : Math.abs(parsed);

    const newEntry = {
      date,
      amount: value,
      description,
      type,
      category: getCategory(description),
    };

    if (editingEntry) {
      updateEntry(editingEntry.id, newEntry);
      setEditingEntry(null);
    } else {
      addEntry(newEntry);
    }

    setAmount("");
    setDescription("");
  };

  const handleEdit = (entry) => {
    setDate(entry.date);
    setAmount(Math.abs(entry.amount).toString());
    setDescription(entry.description);
    setType(entry.type);
    setEditingEntry(entry);
  };

  const handleDelete = (id) => {
    deleteEntry(id);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-navy text-white font-inout">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 bg-navy shadow z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          🏠 Inserisci una spesa/entrata
        </h1>
      </header>

      {/* Form */}
      <div
        className={`px-4 pb-2 bg-navy z-20 transition-shadow duration-300 ${
          hasScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="bg-soft text-navy p-4 sm:p-6 rounded-2xl shadow-md space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 text-base rounded border border-white/20 bg-white focus:outline-none focus:ring"
          />
          <input
            type="text"
            placeholder="Importo (€)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded text-base"
          />
          <textarea
            placeholder="Descrizione"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded text-base"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 text-base rounded border border-white/20 bg-white focus:outline-none focus:ring"
          >
            <option value="Spesa">Spesa</option>
            <option value="Entrata">Entrata</option>
          </select>
          <button
            onClick={handleAdd}
            className="w-full bg-primary hover:bg-accent text-white py-3 rounded transition-all duration-300"
          >
            {editingEntry ? "Modifica" : "Aggiungi"}
          </button>
        </div>
      </div>

      {/* Lista scrollabile */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <h2 className="text-lg font-semibold mb-3">📋 Voci inserite</h2>
        <ul className="space-y-2 text-sm">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="bg-soft p-3 rounded-xl shadow flex justify-between items-start gap-2 text-navy"
            >
              <span>
                {entry.date} — € {entry.amount.toFixed(2)} — {entry.description} ({entry.category})
              </span>
              <span className="flex gap-2">
                <button onClick={() => handleEdit(entry)} className="text-blue-600 underline">
                  Modifica
                </button>
                <button onClick={() => handleDelete(entry.id)} className="text-red-600 underline">
                  Elimina
                </button>
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}