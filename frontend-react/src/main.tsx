import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Login from "./Login.tsx";
import "./index.css";

// Função que verifica se o usuário tem a chave (Token)
const isAuthenticated = () => {
  return localStorage.getItem("gdash_token") !== null;
};

// Componente que protege a rota
// Se tiver token -> Mostra o filho (Dashboard)
// Se NÃO tiver -> Mostra o Login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Login />;
  }
  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  </React.StrictMode>
);
