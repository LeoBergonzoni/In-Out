import { useState } from "react";
import { useEntries } from "../context/EntriesContext";
import PieSpese from "../components/PieChart";
import BarChartEntrateUscite from "../components/BarChartEntrateUscite";

// Funzione per calcolare la settimana del mese
const getWeekOfMonth = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  return Math.ceil(day / 7);
};

export default function Grafici() {
  const { entries } = useEntries();
  const [periodType, setPeriodType] = useState("mese");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const periodOptions = Array.from(
    new Set(
      entries.map((e) => {
        const date = new Date(e.date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        if (periodType === "mese") return `${year}-${month}`;
        const week = getWeekOfMonth(e.date);
        return `W${week}-${month}-${year}`;
      })
    )
  ).sort().reverse();

  const filtered = entries.filter((e) => {
    if (!selectedPeriod) return true;
    if (periodType === "mese") {
      return e.date.startsWith(selectedPeriod);
    } else {
      const [w, m, y] = selectedPeriod.replace("W", "").split("-");
      const week = getWeekOfMonth(e.date);
      const dateObj = new Date(e.date);
      return (
        week.toString() === w &&
        String(dateObj.getMonth() + 1).padStart(2, "0") === m &&
        dateObj.getFullYear().toString() === y
      );
    }
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-navy text-white font-inout">
      {/* Header fisso */}
      <header className="sticky top-0 z-10 bg-navy px-4 pt-12 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">📊 Grafici</h1>
      </header>

      {/* Contenuto scrollabile solo se necessario */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 space-y-6">
        {/* Filtri */}
        <div className="flex gap-4">
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value)}
            className="p-2 rounded text-navy"
          >
            <option value="mese">Mese</option>
            <option value="settimana">Settimana</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 rounded text-navy"
          >
            <option value="">Tutto</option>
            {periodOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Grafici */}
        <div className="bg-soft text-navy p-4 rounded-xl shadow">
          <PieSpese data={filtered} />
        </div>

        <div className="bg-soft text-navy p-4 rounded-xl shadow">
          <BarChartEntrateUscite data={filtered} />
        </div>
      </main>
    </div>
  );
}