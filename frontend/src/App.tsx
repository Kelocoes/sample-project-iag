import type { User } from './types';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { api } from './api';
import { DashboardView } from './components/DashboardView';
import { KanbanView } from './components/KanbanView';
import { ProjectsView } from './components/ProjectsView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { LoginModal } from './components/LoginModal';
import { LayoutDashboard, Kanban, FolderKanban, LogOut, RefreshCw } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Initial light fetch: only load users for session/login
  useEffect(() => {
    const initAuth = async () => {
      try {
        const usersData = await api.getUsers();
        setUsers(usersData);
        if (usersData.length > 0) {
          setCurrentUser(usersData[0]);
        }
      } catch (error) {
        console.error('Error loading users for auth:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    initAuth();
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 space-y-4 font-sans">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Iniciando aplicación...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/project/:id" element={<ProjectDetailView />} />

        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
              {!currentUser && (
                <LoginModal availableUsers={users} onLogin={(u) => setCurrentUser(u)} />
              )}

              <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-600/20 shadow-md">
                    G
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-slate-900 tracking-tight">
                      Sistema de Gestión Jerárquico
                    </h1>
                    <p className="text-[11px] text-slate-500">
                      Organizaciones &gt; Proyectos &gt; Tareas
                    </p>
                  </div>
                </div>

                {currentUser && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
                      <span className="text-slate-500">Sesión Actual:</span>
                      <span
                        className={`font-mono uppercase font-bold text-[10px] px-1.5 py-0.5 rounded ${
                          currentUser.role === 'admin'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {currentUser.role}
                      </span>
                      <span className="text-slate-800 font-semibold pl-1">{currentUser.name}</span>
                    </div>

                    <button
                      onClick={() => setCurrentUser(null)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs transition-colors flex items-center space-x-1 border border-slate-200"
                      title="Cambiar de usuario"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </header>

              <div className="flex-1 flex w-full px-6 py-6 gap-6">
                <aside className="w-56 shrink-0 space-y-2">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `w-full px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-3 transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`
                    }
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard General</span>
                  </NavLink>

                  <NavLink
                    to="/kanban"
                    className={({ isActive }) =>
                      `w-full px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-3 transition-colors ${
                        isActive || window.location.pathname.startsWith('/kanban')
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`
                    }
                  >
                    <Kanban className="w-4 h-4" />
                    <span>Tablero Kanban</span>
                  </NavLink>

                  <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                      `w-full px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-3 transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`
                    }
                  >
                    <FolderKanban className="w-4 h-4" />
                    <span>Proyectos y Equipo</span>
                  </NavLink>
                </aside>

                <main className="flex-1 min-w-0">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route
                      path="/dashboard"
                      element={<DashboardView currentUser={currentUser!} />}
                    />
                    <Route path="/kanban" element={<KanbanView />} />
                    <Route path="/kanban/task/:taskId" element={<KanbanView />} />
                    <Route path="/projects" element={<ProjectsView />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
