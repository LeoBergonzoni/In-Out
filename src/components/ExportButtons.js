import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export default function ExportButtons({ entries }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Rendiconto Finanziario", 14, 16);
    autoTable(doc, {
      head: [["Data", "Importo", "Descrizione", "Categoria", "Tipo"]],
      body: entries.map(e => [
        e.date,
        e.amount.toFixed(2),
        e.description,
        e.category,
        e.type,
      ]),
    });
    doc.save("rendiconto.pdf");
  };

  const exportCSV = () => {
    const csv = Papa.unparse(
      entries.map(e => ({
        Data: e.date,
        Importo: e.amount.toFixed(2),
        Descrizione: e.description,
        Categoria: e.category,
        Tipo: e.type,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "rendiconto.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={exportPDF} className="bg-red-500 text-white px-3 py-1 rounded">
        Esporta PDF
      </button>
      <button onClick={exportCSV} className="bg-green-600 text-white px-3 py-1 rounded">
        Esporta CSV
      </button>
    </div>
  );
}