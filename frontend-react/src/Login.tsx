import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Tenta fazer login no Backend (usando o endereço do Docker/Localhost)
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      // 2. Se deu certo, salva o token no navegador
      localStorage.setItem("gdash_token", response.data.access_token);

      // 3. Recarrega a página para entrar no Dashboard
      window.location.href = "/";
    } catch (err) {
      setError("Acesso negado. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            GDASH Login
          </CardTitle>
          <p className="text-center text-slate-400 text-sm">Entre para acessar a Weather Station</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <User size={16} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-md bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="admin@gdash.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Lock size={16} /> Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-md bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded bg-red-900/30 border border-red-900 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Acessar Sistema"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
