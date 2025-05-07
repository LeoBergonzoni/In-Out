import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

export default function PieSpese({ data }) {
  const chartData = Object.entries(
    data.reduce((acc, entry) => {
      if (entry.type === "Spesa") {
        acc[entry.category] = (acc[entry.category] || 0) + Math.abs(entry.amount);
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-soft text-navy p-4 rounded-xl shadow w-full flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-center">Distribuzione spese per categoria</h2>
      <div className="w-full flex justify-center">
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}