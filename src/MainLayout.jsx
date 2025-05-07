import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const tabs = [
    { emoji: "🏠", label: "Home", path: "/home" },
    { emoji: "📊", label: "Grafici", path: "/grafici" },
    { emoji: "🏷️", label: "Rendiconto", path: "/rendiconto" },
    { emoji: "📄", label: "Riepilogo", path: "/riepilogo" },
    { emoji: "🔍", label: "Cerca", path: "/cerca" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-navy text-white font-inout">
      {/* Header opzionale con logout */}
      <header className="flex justify-end items-center px-4 pt-4 pb-2">
        {user && (
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Esci
          </button>
        )}
      </header>

      {/* Contenuto principale scrollabile */}
      <main className="flex-1 overflow-y-auto pb-28 px-2 sm:px-4">
        <Outlet />
      </main>

      {/* Tab bar fissa in basso */}
      <nav className="fixed bottom-0 left-0 right-0 bg-soft text-navy py-4 border-t border-white/10 shadow-lg z-50">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center text-xs ${
                location.pathname === tab.path
                  ? "text-white font-semibold"
                  : "text-navy/60"
              }`}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className="mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}