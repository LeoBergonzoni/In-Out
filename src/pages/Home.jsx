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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("dataDesc");

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
    <div className="flex flex-col h-screen overflow-hidden bg-navy text-white font-inout">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 bg-navy shadow z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          🏠 Inserisci una spesa/entrata
        </h1>
      </header>

      {/* Form */}
      <div className="px-4 pb-4 bg-navy">
  <div className="max-w-md mx-auto bg-soft text-navy p-4 sm:p-6 rounded-2xl shadow-md space-y-3 w-full">
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

      {/* Pulsante modale */}
      <div className="px-4 pb-8">
  <div className="max-w-md mx-auto">
    <button
      onClick={() => setShowModal(true)}
      className="w-full bg-soft text-navy py-3 rounded-lg font-semibold shadow hover:bg-white transition"
    >
      📋 Visualizza e modifica Voci inserite
    </button>
  </div>
</div>

      {/* Modale */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white text-navy p-6 rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-red-600 font-bold text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">📋 Voci inserite</h2>

            {/* Cerca e ordina */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Cerca per descrizione..."
                className="flex-1 p-2 border rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="dataDesc">📅 Data ↓</option>
                <option value="dataAsc">📅 Data ↑</option>
                <option value="amountDesc">💶 Importo ↓</option>
                <option value="amountAsc">💶 Importo ↑</option>
              </select>
            </div>

            {/* Lista filtrata e ordinata */}
            <ul className="space-y-3 text-sm">
              {[...entries]
                .filter((entry) =>
                  entry.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => {
                  switch (sortKey) {
                    case "dataAsc":
                      return a.date.localeCompare(b.date);
                    case "dataDesc":
                      return b.date.localeCompare(a.date);
                    case "amountAsc":
                      return a.amount - b.amount;
                    case "amountDesc":
                      return b.amount - a.amount;
                    default:
                      return 0;
                  }
                })
                .map((entry) => (
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