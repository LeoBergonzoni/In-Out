import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function BarChartEntrateUscite({ data }) {
  const riepilogo = data.reduce(
    (acc, e) => {
      if (e.type === "Entrata") acc.Entrate += e.amount;
      if (e.type === "Spesa") acc.Uscite += Math.abs(e.amount);
      return acc;
    },
    { Entrate: 0, Uscite: 0 }
  );

  const chartData = [
    { nome: "Entrate", valore: riepilogo.Entrate },
    { nome: "Uscite", valore: riepilogo.Uscite }
  ];

  return (
    <div className="bg-soft text-navy p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Confronto Entrate / Uscite</h2>
      <ResponsiveContainer width="100%" height={310}>
        <BarChart data={chartData}>
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="valore" fill="#4a5ba7" name="Totale" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}