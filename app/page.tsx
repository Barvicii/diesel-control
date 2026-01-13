'use client';

import { useState, useEffect } from 'react';
import { Fuel, TrendingDown, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';
import Link from 'next/link';

interface TankConfig {
  _id: string;
  capacidadTotal: number;
  litrosActuales: number;
  listaMaquinas: string[];
  listaTareas: string[];
}

export default function Home() {
  const [config, setConfig] = useState<TankConfig | null>(null);
  const [litros, setLitros] = useState<string>('');
  const [maquina, setMaquina] = useState<string>('');
  const [customMaquina, setCustomMaquina] = useState<string>('');
  const [tarea, setTarea] = useState<string>('');
  const [customTarea, setCustomTarea] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const maquinaFinal = maquina === 'custom' ? customMaquina : maquina;
    const tareaFinal = tarea === 'custom' ? customTarea : tarea;

    if (!litros || !maquinaFinal || !tareaFinal) {
      setMessage({ type: 'error', text: 'Please complete all fields' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          litros: parseFloat(litros),
          maquina: maquinaFinal,
          tarea: tareaFinal,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `✓ Load registered. ${data.litrosRestantes.toFixed(0)} liters remaining` });
        setLitros('');
        setMaquina('');
        setCustomMaquina('');
        setTarea('');
        setCustomTarea('');
        fetchConfig();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error registering load' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setLoading(false);
    }
  };

  const porcentaje = config ? (config.litrosActuales / config.capacidadTotal) * 100 : 0;
  const nivelBajo = porcentaje < 20;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Fuel className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Diesel Control</h1>
          <p className="mt-2 text-sm text-gray-600">Fuel Management</p>
        </div>

        {/* Litros Disponibles - Destacado */}
        {config && (
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="text-center">
              <p className="text-sm font-medium opacity-90 mb-2">Available Liters</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold">
                  {config.litrosActuales.toFixed(0)}
                </span>
                <span className="text-2xl font-semibold opacity-90">L</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-full max-w-xs bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      nivelBajo ? 'bg-red-300' : 'bg-white'
                    }`}
                    style={{ width: `${Math.max(porcentaje, 2)}%` }}
                  />
                </div>
                <span className="text-sm font-medium opacity-90">{porcentaje.toFixed(0)}%</span>
              </div>
              <p className="text-xs opacity-75 mt-3">
                Total capacity: {config.capacidadTotal} liters
              </p>
              {nivelBajo && (
                <div className="mt-4 flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-300/30">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-sm font-medium">Low level! Contact administrator</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tank Status Card */}
        {config && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>To refill the tank, go to:</span>
              <Link 
                href="/admin" 
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Register Load</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Litros Input */}
            <div>
              <label htmlFor="litros" className="block text-sm font-medium text-gray-700 mb-1">
                Liters
              </label>
              <input
                type="number"
                id="litros"
                value={litros}
                onChange={(e) => setLitros(e.target.value)}
                placeholder="e.g. 150"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-lg"
                required
              />
            </div>

            {/* Maquina Select */}
            <div>
              <label htmlFor="maquina" className="block text-sm font-medium text-gray-700 mb-1">
                Machine
              </label>
              <select
                id="maquina"
                value={maquina}
                onChange={(e) => setMaquina(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select machine...</option>
                {config?.listaMaquinas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="custom">✏️ Other / Custom</option>
              </select>
            </div>

            {/* Custom Machine Input */}
            {maquina === 'custom' && (
              <div>
                <label htmlFor="customMaquina" className="block text-sm font-medium text-gray-700 mb-1">
                  Machine name
                </label>
                <input
                  type="text"
                  id="customMaquina"
                  value={customMaquina}
                  onChange={(e) => setCustomMaquina(e.target.value)}
                  placeholder="e.g. Massey Ferguson 5610 Tractor"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            )}

            {/* Tarea Select */}
            <div>
              <label htmlFor="tarea" className="block text-sm font-medium text-gray-700 mb-1">
                Task
              </label>
              <select
                id="tarea"
                value={tarea}
                onChange={(e) => setTarea(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select task...</option>
                {config?.listaTareas.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option value="custom">✏️ Other / Custom</option>
              </select>
            </div>

            {/* Custom Task Input */}
            {tarea === 'custom' && (
              <div>
                <label htmlFor="customTarea" className="block text-sm font-medium text-gray-700 mb-1">
                  Task name
                </label>
                <input
                  type="text"
                  id="customTarea"
                  value={customTarea}
                  onChange={(e) => setCustomTarea(e.target.value)}
                  placeholder="e.g. Maintenance"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5" />
                  Register Load
                </>
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-xl flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/admin"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Go to Admin Panel →
          </Link>
        </div>
      </div>
    </div>
  );
}
