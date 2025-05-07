import { useState } from "react";
import { useEntries } from "../context/EntriesContext";

export default function Cerca() {
  const { entries } = useEntries();
  const [query, setQuery] = useState("");

  const risultati = entries.filter((entry) =>
    entry.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-navy text-white font-inout">
      {/* Blocco fisso con titolo + campo input */}
      <div className="sticky top-0 z-30 bg-navy px-4 pt-12 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3">🔍 Cerca voci</h1>
        <input
          type="text"
          placeholder="Cerca descrizione..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded text-navy"
        />
      </div>

      {/* Lista scrollabile */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <div className="bg-soft text-navy p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Risultati ({risultati.length})
          </h2>
          {risultati.length === 0 ? (
            <p className="text-sm">Nessun risultato trovato.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {risultati.map((entry) => (
                <li key={entry.id} className="border-b pb-2">
                  {entry.date} — € {entry.amount.toFixed(2)} — {entry.description} ({entry.category})
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}