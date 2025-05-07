import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/Home";
import Grafici from "./pages/Grafici";
import RendicontoCategoria from "./pages/RendicontoCategoria";
import Riepilogo from "./pages/Riepilogo";
import Cerca from "./pages/Cerca";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-navy text-white font-inout px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-white text-sm bg-navy px-4 py-2 rounded-xl shadow">
            Modalità test attiva
          </div>
          <button
            onClick={() => alert("Logout disabilitato in modalità test")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            Esci
          </button>
        </div>

        {/* 👇 Qui aggiungiamo le route interne visibili dopo il login */}
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="grafici" element={<Grafici />} />
            <Route path="rendiconto" element={<RendicontoCategoria />} />
            <Route path="riepilogo" element={<Riepilogo />} />
            <Route path="cerca" element={<Cerca />} />
            <Route index element={<Navigate to="home" />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}