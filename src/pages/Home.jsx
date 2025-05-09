import { useState } from "react";
import { format } from "date-fns";
import { useEntries } from "../context/EntriesContext";

export default function Home() {
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Spesa");
  const [editingEntry, setEditingEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { entries, addEntry, updateEntry, deleteEntry } = useEntries();

  const categories = {
    Sopravvivenza: ["spesa", "farmacia", "medico", "affitto", "bolletta", "condominio", "trasporto", "benzina", "benza", "parcheggio"],
    Optional: ["bar", "ristorante", "tabacchi", "cosmetica", "shopping", "pranzo", "cena", "aperitivo", "apero", "gelato", "amazon"],
    Cultura: ["cinema", "teatro", "libri"],
    Abbonamenti: ["abbonamento"],
    ContoCointestato: ["cointestato"],
    Viaggi: ["treno", "vacanza", "aereo", "albergo", "traghetto"],
    Stipendio: ["stipendio"],
    Fatturato_Incassato: ["pagamento", "fattura", "cliente"],
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
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-navy text-white font-inout px-4 pt-12 pb-8 flex flex-col items-center">
      {/* Titolo fisso */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        🏠 Inserisci una spesa/entrata
      </h1>

      {/* Form fisso */}
      <div className="w-full max-w-xl bg-soft text-navy p-4 sm:p-6 rounded-2xl shadow-md space-y-3 mb-6">
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

      {/* Pulsante fisso */}
      <div className="w-full max-w-xl">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-white text-navy py-3 rounded-lg font-semibold shadow hover:bg-soft transition"
        >
          📋 Visualizza e modifica Voci inserite
        </button>
      </div>

      {/* Modale scrollabile */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-navy p-6 rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-red-600 font-bold text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">📋 Voci inserite</h2>
            <ul className="space-y-3 text-sm">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="bg-soft p-3 rounded-xl shadow flex justify-between items-start gap-2"
                >
                  <span>
                    {entry.date} — € {entry.amount.toFixed(2)} — {entry.description} ({entry.category})
                  </span>
                  <span className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-blue-600 underline"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-600 underline"
                    >
                      Elimina
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}