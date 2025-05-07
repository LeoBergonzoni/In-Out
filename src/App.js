import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import MainLayout from "./MainLayout";
import Home from "./pages/Home";
import Grafici from "./pages/Grafici";
import RendicontoCategoria from "./pages/RendicontoCategoria";
import Riepilogo from "./pages/Riepilogo";
import Cerca from "./pages/Cerca";
import Login from "./Login";

// ✅ Wrapper per route protette
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // oppure puoi mettere uno spinner

  return user ? children : <Navigate to="/" replace />;
}

// ✅ Wrapper per bloccare accesso a login se già loggato
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return !user ? children : <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 👤 Pagina di login: accessibile solo se non loggato */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🔐 Layout protetto con tutte le pagine interne */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="grafici" element={<Grafici />} />
          <Route path="rendiconto" element={<RendicontoCategoria />} />
          <Route path="riepilogo" element={<Riepilogo />} />
          <Route path="cerca" element={<Cerca />} />
        </Route>

        {/* Catch-all: reindirizza a login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}