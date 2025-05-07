import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import App from "./App";
import { EntriesProvider } from "./context/EntriesContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <EntriesProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </HashRouter>
      </EntriesProvider>
    </AuthProvider>
  </React.StrictMode>
);