'use client';

import { useState, useEffect } from 'react';
import {
  Trash2,
  RefreshCw,
  Plus,
  X,
  Settings,
  Database,
  Calendar,
  Fuel,
  ChevronLeft,
  Lock,
  Download,
} from 'lucide-react';
import Link from 'next/link';

interface Log {
  _id: string;
  fecha: string;
  litros: number;
  maquina: string;
  tarea: string;
}

interface TankConfig {
  _id: string;
  capacidadTotal: number;
  litrosActuales: number;
  listaMaquinas: string[];
  listaTareas: string[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [config, setConfig] = useState<TankConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'config'>('logs');
  
  // Config states
  const [newMaquina, setNewMaquina] = useState('');
  const [newTarea, setNewTarea] = useState('');
  const [litrosAñadir, setLitrosAñadir] = useState('');

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '456123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setPasswordError(false);
      fetchData();
    } else {
      setPasswordError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    setPassword('');
  };

  const fetchData = async () => {
    try {
      const [logsRes, configRes] = await Promise.all([
        fetch('/api/logs'),
        fetch('/api/config'),
      ]);

      const logsData = await logsRes.json();
      const configData = await configRes.json();

      if (logsData.success) setLogs(logsData.data);
      if (configData.success) setConfig(configData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm('Delete this record?')) return;

    try {
      const response = await fetch(`/api/logs?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const resetTank = async () => {
    if (!confirm('Reset the tank to total capacity?')) return;

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
        fetchData();
      }
    } catch (error) {
      console.error('Error resetting:', error);
    }
  };

  const addLitros = async () => {
    const litros = parseFloat(litrosAñadir);
    if (!litros || litros <= 0) return;

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', litros }),
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
        setLitrosAñadir('');
        fetchData();
      }
    } catch (error) {
      console.error('Error adding liters:', error);
    }
  };

  const addMaquina = async () => {
    if (!newMaquina.trim() || !config) return;

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listaMaquinas: [...config.listaMaquinas, newMaquina.trim()],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
        setNewMaquina('');
      }
    } catch (error) {
      console.error('Error adding machine:', error);
    }
  };

  const removeMaquina = async (maquina: string) => {
    if (!config) return;

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listaMaquinas: config.listaMaquinas.filter((m) => m !== maquina),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Error removing machine:', error);
    }
  };

  const addTarea = async () => {
    if (!newTarea.trim() || !config) return;

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listaTareas: [...config.listaTareas, newTarea.trim()],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
        setNewTarea('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const removeTarea = async (tarea: string) => {
    if (!config) return;

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listaTareas: config.listaTareas.filter((t) => t !== tarea),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const exportToCSV = () => {
    if (logs.length === 0) return;

    // CSV Headers
    const headers = ['Date', 'Machine', 'Task', 'Liters'];
    
    // CSV Rows
    const rows = logs.map(log => [
      formatDate(log.fecha),
      log.maquina,
      log.tarea,
      log.litros.toFixed(1)
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `fuel-history-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
              <p className="mt-2 text-sm text-gray-600">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="Enter password"
                  autoFocus
                  required
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-600">Incorrect password. Try again.</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition"
              >
                Access Panel
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Manage history and system configuration</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === 'logs'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Database className="w-5 h-5 inline-block mr-2" />
              Load History
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === 'config'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-5 h-5 inline-block mr-2" />
              Configuration
            </button>
          </div>

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  History ({logs.length} records)
                </h2>
                {logs.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                )}
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No records yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Machine
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Task
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Liters
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(log.fecha)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{log.maquina}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{log.tarea}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                            <div className="flex items-center justify-end gap-1">
                              <Fuel className="w-4 h-4 text-primary-600" />
                              {log.litros.toFixed(1)} L
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteLog(log._id)}
                              className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Config Tab */}
          {activeTab === 'config' && config && (
            <div className="p-6 space-y-6">
              {/* Tank Management */}
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border-2 border-primary-200">
                <div className="flex items-center gap-2 mb-4">
                  <Fuel className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tank Refill
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Use this section to refill the tank when a physical refuel is completed.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Total Capacity</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {config.capacidadTotal} L
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Current Liters</p>
                        <p className="text-3xl font-bold text-primary-600">
                        {config.litrosActuales.toFixed(0)} L
                      </p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{ width: `${Math.min((config.litrosActuales / config.capacidadTotal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Opciones de Recarga */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Refill Options</p>
                    
                    <div className="space-y-3">
                      {/* Resetear tanque completo */}
                      <div>
                        <button
                          onClick={resetTank}
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Fill Tank Completely ({config.capacidadTotal} L)
                        </button>
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Resets the tank to its maximum capacity
                        </p>
                      </div>

                      {/* Separador */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="text-xs text-gray-500 font-medium">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                      </div>

                      {/* Añadir cantidad específica */}
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">
                          Add Specific Amount
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={litrosAñadir}
                            onChange={(e) => setLitrosAñadir(e.target.value)}
                            placeholder="e.g. 2000"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                          <button
                            onClick={addLitros}
                            disabled={!litrosAñadir || parseFloat(litrosAñadir) <= 0}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition flex items-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            Add
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Add the exact amount of liters refilled
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gestión de Listas */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  List Configuration
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Manage predefined machines and tasks that appear in the form
                </p>
              </div>

              {/* Machines List */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Predefined Machines
                </h3>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newMaquina}
                    onChange={(e) => setNewMaquina(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMaquina()}
                    placeholder="New machine"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={addMaquina}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {config.listaMaquinas.map((maquina) => (
                    <div
                      key={maquina}
                      className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-900">{maquina}</span>
                      <button
                        onClick={() => removeMaquina(maquina)}
                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks List */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Predefined Tasks
                </h3>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newTarea}
                    onChange={(e) => setNewTarea(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTarea()}
                    placeholder="New task"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={addTarea}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {config.listaTareas.map((tarea) => (
                    <div
                      key={tarea}
                      className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-900">{tarea}</span>
                      <button
                        onClick={() => removeTarea(tarea)}
                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
