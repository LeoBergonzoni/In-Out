import { useEntries } from "../context/EntriesContext";

export default function RendicontoCategoria() {
  const { entries = [] } = useEntries(); // fallback a [] per evitare errori

  const grouped = entries.reduce((acc, e) => {
    const key = `${e.type} - ${e.category}`;
    acc[key] = (acc[key] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-navy text-white font-inout">
      {/* Header fisso */}
      <header className="sticky top-0 z-10 bg-navy px-4 pt-12 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          🏷️ Rendiconto per Categoria
        </h1>
      </header>

      {/* Contenuto scrollabile */}
      <main className="flex-1 overflow-y-auto px-4 pb-28">
        <div className="bg-soft text-navy p-4 rounded-xl shadow">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-sm">Nessuna voce trovata.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {Object.entries(grouped).map(([key, total]) => (
                <li key={key}>
                  {key}: € {total.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}