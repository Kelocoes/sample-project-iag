import React, { useState } from 'react';
import type { User } from '../types';
import { Key, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  onLogin: (user: User) => void;
  availableUsers: User[];
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, availableUsers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = availableUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      onLogin(found);
    } else {
      setError('Usuario no encontrado. Selecciona uno de los accesos rápidos abajo.');
    }
  };

  const selectUser = (user: User) => {
    onLogin(user);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 mb-1">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Portal de Acceso de Usuarios</h2>
          <p className="text-sm text-slate-500">
            Inicia sesión con tu correo electrónico o selecciona una de las 3 cuentas de prueba.
          </p>
        </div>

        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@empresa.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Acceso Rápido de Usuarios
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => selectUser(u)}
                className="w-full p-3 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 rounded-xl text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      u.role === 'admin'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                      {u.name}
                    </div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                      u.role === 'admin'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {u.role}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
