import { useState } from "react";
import { useEntries } from "../context/EntriesContext";

export default function Riepilogo() {
  const { entries } = useEntries();
  const [periodType, setPeriodType] = useState("mese");
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const getWeekOfMonth = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    return Math.ceil(day / 7);
  };

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

  const monthlySummary = filtered.reduce((acc, entry) => {
    const month = entry.date.slice(0, 7);
    if (!acc[month]) acc[month] = { Entrata: 0, Spesa: 0 };
    acc[month][entry.type] += entry.amount;
    return acc;
  }, {});

  const weeklySummary = filtered.reduce((acc, entry) => {
    const [year, month] = entry.date.split("-");
    const week = getWeekOfMonth(entry.date);
    const label = `Settimana ${week} (${month}/${year})`;
    if (!acc[label]) acc[label] = { Entrata: 0, Spesa: 0 };
    acc[label][entry.type] += entry.amount;
    return acc;
  }, {});

  const getFormattedPeriodLabel = () => {
    if (!selectedPeriod) return "";
    if (periodType === "mese") {
      const [year, month] = selectedPeriod.split("-");
      const formatter = new Intl.DateTimeFormat("it-IT", { month: "long" });
      return `${formatter.format(new Date(`${year}-${month}-01`))} ${year}`;
    } else {
      const [week, month, year] = selectedPeriod.replace("W", "").split("-");
      return `Settimana ${week} (${month}/${year})`;
    }
  };

  const periodLabel = getFormattedPeriodLabel();

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-navy text-white font-inout">
      {/* Header fisso */}
      <header className="sticky top-0 z-10 bg-navy px-4 pt-12 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          📄 Riepilogo
        </h1>
      </header>

      {/* Contenuto scrollabile */}
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

        {/* Riepilogo Mensile */}
        <div className="bg-soft text-navy p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Riepilogo Mensile</h2>
          <ul className="space-y-1 text-sm">
            {Object.entries(monthlySummary).map(([month, data]) => (
              <li key={month}>
                {month}: Entrate € {data.Entrata.toFixed(2)} — Uscite €{" "}
                {Math.abs(data.Spesa).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        {/* Riepilogo Settimanale */}
        <div className="bg-soft text-navy p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Riepilogo Settimanale {periodLabel && `– ${periodLabel}`}
          </h2>
          <ul className="space-y-1 text-sm">
            {Object.entries(weeklySummary).map(([week, data]) => (
              <li key={week}>
                {week}: Entrate € {data.Entrata.toFixed(2)} — Uscite €{" "}
                {Math.abs(data.Spesa).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}