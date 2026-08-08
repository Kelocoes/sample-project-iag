import type { User, Project, Task, DashboardMetrics, Organization } from './types';
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
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, orgsData, projectsData, tasksData, usersData] = await Promise.all([
        api.getDashboardMetrics(),
        api.getOrganizations(),
        api.getProjects(),
        api.getTasks(),
        api.getUsers(),
      ]);

      setMetrics(metricsData);
      setOrganizations(orgsData);
      setProjects(projectsData);
      setTasks(tasksData);
      setUsers(usersData);

      if (!currentUser && usersData.length > 0) {
        setCurrentUser(usersData[0]);
      }
    } catch (error) {
      console.error('Error loading API data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateTaskStatus = async (taskId: number, newStatus: Task['status']) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      loadData();
    } catch (e) {
      console.error('Error updating task status:', e);
    }
  };

  const handleUpdateTaskDetails = async (taskId: number, updatedData: Partial<Task>) => {
    try {
      await api.updateTask(taskId, updatedData);
      loadData();
    } catch (e) {
      console.error('Error updating task details:', e);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.deleteTask(taskId);
      loadData();
    } catch (e) {
      console.error('Error deleting task:', e);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await api.createTask(taskData);
      loadData();
    } catch (e) {
      console.error('Error creating task:', e);
    }
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      await api.createProject(projectData);
      loadData();
    } catch (e) {
      console.error('Error creating project:', e);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await api.deleteProject(projectId);
      loadData();
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  };

  const handleCreateOrganization = async (orgData: any) => {
    try {
      await api.createOrganization(orgData);
      loadData();
    } catch (e) {
      console.error('Error creating organization:', e);
    }
  };

  const handleDeleteOrganization = async (orgId: number) => {
    try {
      await api.deleteOrganization(orgId);
      loadData();
    } catch (e) {
      console.error('Error deleting organization:', e);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await api.createUser(userData);
      loadData();
    } catch (e) {
      console.error('Error creating user:', e);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 space-y-4 font-sans">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Cargando plataforma de gestión...</span>
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
                      element={
                        <DashboardView
                          metrics={metrics}
                          projects={projects}
                          organizations={organizations}
                          currentUser={currentUser!}
                          onDeleteOrganization={handleDeleteOrganization}
                          onCreateOrganization={handleCreateOrganization}
                        />
                      }
                    />
                    <Route
                      path="/kanban"
                      element={
                        <KanbanView
                          tasks={tasks}
                          projects={projects}
                          users={users}
                          onUpdateTaskStatus={handleUpdateTaskStatus}
                          onUpdateTaskDetails={handleUpdateTaskDetails}
                          onDeleteTask={handleDeleteTask}
                          onCreateTask={handleCreateTask}
                        />
                      }
                    />
                    <Route
                      path="/kanban/task/:taskId"
                      element={
                        <KanbanView
                          tasks={tasks}
                          projects={projects}
                          users={users}
                          onUpdateTaskStatus={handleUpdateTaskStatus}
                          onUpdateTaskDetails={handleUpdateTaskDetails}
                          onDeleteTask={handleDeleteTask}
                          onCreateTask={handleCreateTask}
                        />
                      }
                    />
                    <Route
                      path="/projects"
                      element={
                        <ProjectsView
                          projects={projects}
                          users={users}
                          organizations={organizations}
                          tasks={tasks}
                          onCreateProject={handleCreateProject}
                          onDeleteProject={handleDeleteProject}
                          onCreateUser={handleCreateUser}
                        />
                      }
                    />
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
