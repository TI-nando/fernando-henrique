import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// Importando ícones, incluindo FileDown para o CSV
import { Wind, Droplets, Thermometer, CloudSun, Sparkles, FileDown } from "lucide-react";

interface WeatherData {
  _id: string;
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  insight?: string;
  createdAt: string;
}

function App() {
  const [data, setData] = useState<WeatherData[]>([]);

  const getWeatherDescription = (codeString: string) => {
    const code = Number(codeString);
    if (code === 0) return "Céu Limpo ☀️";
    if ([1, 2, 3].includes(code)) return "Parcialmente Nublado ⛅";
    if ([45, 48].includes(code)) return "Nevoeiro 🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "Chuvisco 🌧️";
    if ([61, 63, 65, 66, 67].includes(code)) return "Chuva ☔";
    if ([71, 73, 75, 77].includes(code)) return "Neve ❄️";
    if ([80, 81, 82].includes(code)) return "Pancadas de Chuva 🌦️";
    if ([95, 96, 99].includes(code)) return "Tempestade ⛈️";
    return `Desconhecido (${code})`;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("gdash_token");
      // Se não tem token, não busca (evita erro 401 em loop)
      if (!token) return;

      const response = await axios.get("http://localhost:3000/weather", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data.reverse());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      // Se der erro 401 (Token expirado), desloga
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("gdash_token");
        window.location.reload();
      }
    }
  };

  // 👇 FUNÇÃO PARA BAIXAR O CSV
  const handleDownloadCsv = async () => {
    try {
      const token = localStorage.getItem("gdash_token");
      const response = await axios.get("http://localhost:3000/weather/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Importante: diz pro axios que é um arquivo
      });

      // Truque para forçar o download no navegador
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dados_climaticos.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao baixar CSV", error);
      alert("Erro ao baixar o relatório. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              GDASH Weather Station 🚀
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-slate-400 text-sm">Ipameri, GO</p>

              {/* BOTÃO CSV (Verde) */}
              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 border border-green-900/50 px-2 py-0.5 rounded hover:bg-green-900/20 transition-colors cursor-pointer"
              >
                <FileDown size={14} /> CSV
              </button>

              {/* BOTÃO SAIR (Vermelho) */}
              <button
                onClick={() => {
                  localStorage.removeItem("gdash_token");
                  window.location.reload();
                }}
                className="text-xs text-red-400 hover:text-red-300 border border-red-900/50 px-2 py-0.5 rounded hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          </div>
          <div className="animate-pulse flex items-center bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </div>

        {/* Card de Insight (IA) */}
        {current?.insight && (
          <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 border-indigo-500/30 shadow-lg">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <CardTitle className="text-md font-bold text-indigo-100">Análise Inteligente do Clima</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-indigo-50 font-medium">"{current.insight}"</p>
            </CardContent>
          </Card>
        )}

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800 shadow-lg hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Temperatura</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{current?.temperature ?? "--"}°C</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 shadow-lg hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Umidade</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{current?.humidity ?? "--"}%</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 shadow-lg hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Vento</CardTitle>
              <Wind className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{current?.windSpeed ?? "--"} km/h</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 shadow-lg hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Condição</CardTitle>
              <CloudSun className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white leading-none mt-1">
                {current ? getWeatherDescription(current.condition) : "--"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico */}
        <Card className="bg-slate-900 border-slate-800 col-span-4 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Histórico de Temperatura</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="createdAt"
                    tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="#64748b" domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                    itemStyle={{ color: "#22d3ee" }}
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, fill: "#22d3ee" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
