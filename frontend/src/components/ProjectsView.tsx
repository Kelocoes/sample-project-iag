import React, { useEffect, useState } from 'react';
import type { Project, User, Task, Organization } from '../types';
import { api } from '../api';
import { Plus, Users, DollarSign, ExternalLink, Trash2, UserPlus, RefreshCw } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // New Project State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(15000);
  const [organizationId, setOrganizationId] = useState<number>(1);
  const [managerId, setManagerId] = useState<number>(1);

  // New User State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'manager' | 'user'>('manager');
  const [userOrgId, setUserOrgId] = useState<number>(1);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [projectsData, usersData, orgsData, tasksData] = await Promise.all([
        api.getProjects(),
        api.getUsers(),
        api.getOrganizations(),
        api.getTasks(),
      ]);
      setProjects(projectsData);
      setUsers(usersData);
      setOrganizations(orgsData);
      setTasks(tasksData);

      if (orgsData.length > 0) {
        setOrganizationId(orgsData[0].id);
        setUserOrgId(orgsData[0].id);
      }
      if (usersData.length > 0) {
        setManagerId(usersData[0].id);
      }
    } catch (error) {
      console.error('Error loading projects data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleCreateUser = async (userData: any) => {
    try {
      await api.createUser(userData);
      loadData();
    } catch (e) {
      console.error('Error creating user:', e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    handleCreateProject({
      title,
      description,
      budget,
      organizationId: organizationId || organizations[0]?.id || 1,
      managerId: managerId || users[0]?.id || 1,
      status: 'active',
    });

    setTitle('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    handleCreateUser({
      name: userName,
      email: userEmail,
      role: userRole,
      password: 'password123',
      organizationId: userOrgId || organizations[0]?.id || 1,
    });

    setUserName('');
    setUserEmail('');
    setIsUserModalOpen(false);
  };

  const openProjectDetails = (projectId: number) => {
    window.open(`/project/${projectId}`, '_blank');
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500 space-y-3 font-sans">
        <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Cargando proyectos y usuarios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Proyectos y Participantes</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión completa de iniciativas, asignación de managers y registros de usuarios.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors flex items-center space-x-2 border border-slate-200"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Usuario</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const projectTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
          const progressPercent = projectTasks.length
            ? Math.round((completedTasks / projectTasks.length) * 100)
            : 0;

          return (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono uppercase font-bold">
                    Proyecto #{proj.id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase font-medium">
                      {proj.status}
                    </span>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Eliminar proyecto y sus tareas (Sin confirmación)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 leading-snug">{proj.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {proj.description}
                </p>

                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Organización:</span>
                    <strong className="text-slate-700">{proj.organization?.name || 'Central'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Manager Asignado:</span>
                    <strong className="text-indigo-600">{proj.manager?.name || 'Sin asignar'}</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-emerald-600" />
                      <span>Presupuesto</span>
                    </span>
                    <div className="text-sm font-bold font-mono text-slate-800">
                      ${proj.budget?.toLocaleString() || '15,000'}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center space-x-1">
                      <Users className="w-3 h-3 text-indigo-600" />
                      <span>Tareas</span>
                    </span>
                    <div className="text-sm font-bold font-mono text-slate-800">
                      {projectTasks.length} Tareas
                    </div>
                  </div>
                </div>

                {/* Progreso */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Avance Tareas</span>
                    <span className="font-mono">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => openProjectDetails(proj.id)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Ver Detalles Adicionales</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Crear Proyecto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Crear Nuevo Proyecto</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Título del Proyecto
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Campaña de Capacitación del Personal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objetivos operacionales..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Organización
                  </label>
                  <select
                    value={organizationId}
                    onChange={(e) => setOrganizationId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Manager Asignado
                  </label>
                  <select
                    value={managerId}
                    onChange={(e) => setManagerId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Presupuesto Estimado ($ USD)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Usuario en Proyecto/Organizacion */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Registrar Nuevo Usuario</h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="ej. Sofía Ramírez"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="sofia@empresa.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Rol en Sistema
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as 'manager' | 'user')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="manager">Manager</option>
                    <option value="user">Usuario</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Organización
                  </label>
                  <select
                    value={userOrgId}
                    onChange={(e) => setUserOrgId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                >
                  Registrar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
