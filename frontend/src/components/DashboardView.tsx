import React, { useEffect, useState } from 'react';
import type { User, Project, DashboardMetrics, Organization } from '../types';
import { api } from '../api';
import { FolderKanban, CheckCircle2, Users, ArrowUpRight, Building2, Trash2, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardViewProps {
  currentUser: User;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, orgsData, projectsData] = await Promise.all([
        api.getDashboardMetrics(),
        api.getOrganizations(),
        api.getProjects(),
      ]);
      setMetrics(metricsData);
      setOrganizations(orgsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName) return;

    try {
      await api.createOrganization({
        name: orgName,
        description: orgDesc,
        adminOwnerId: currentUser.id,
      });
      setOrgName('');
      setOrgDesc('');
      setIsOrgModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const handleDeleteOrganization = async (orgId: number) => {
    try {
      await api.deleteOrganization(orgId);
      loadData();
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500 space-y-3 font-sans">
        <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Cargando métricas y proyectos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas en tema Claro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Organizaciones</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{metrics?.totalOrganizations || organizations.length}</div>
          <p className="text-xs text-slate-500">Empresas / Unidades registradas</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Proyectos Totales</span>
            <FolderKanban className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{metrics?.totalProjects || projects.length}</div>
          <p className="text-xs text-slate-500">Asociados a organizaciones</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Tareas Totales</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{metrics?.totalTasks || 0}</div>
          <p className="text-xs text-slate-500">Distribuídas en tableros</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Usuarios Totales</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{metrics?.totalUsers || 3}</div>
          <p className="text-xs text-slate-500">Admin y Managers en sistema</p>
        </div>
      </div>

      {/* Jerarquía: Sección de Organizaciones */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <span>Organizaciones Registradas</span>
            </h3>
            <p className="text-xs text-slate-500">Jerarquía Superior: Administrador &gt; Organización &gt; Proyectos</p>
          </div>

          <button
            onClick={() => setIsOrgModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Organización</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded uppercase font-bold">
                    Organización #{org.id}
                  </span>
                  <button
                    onClick={() => handleDeleteOrganization(org.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Eliminar organización (sin confirmación)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-800">{org.name}</h4>
                <p className="text-xs text-slate-500">{org.description}</p>
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Proyectos asociados: <strong className="text-slate-700 font-mono">{projects.filter(p => p.organizationId === org.id).length}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proyectos Activos de las Organizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Proyectos Activos</h3>
            <span className="text-xs text-slate-500 font-mono">Total: {projects.length}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-slate-50 p-3 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-slate-800">{proj.title}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{proj.description}</p>
                  <div className="text-[11px] text-slate-500">
                    Manager Asignado: <strong className="text-slate-700">{proj.manager?.name || 'Sin asignar'}</strong>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/kanban?projectId=${proj.id}`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                >
                  <span>Ver Tablero</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Desglose de Estado de Tareas */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-800">Distribución de Tareas</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Por Hacer</span>
                <span className="font-mono">{metrics?.taskStatusBreakdown?.todo || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-slate-400 h-2 rounded-full"
                  style={{
                    width: `${
                      ((metrics?.taskStatusBreakdown?.todo || 0) / (metrics?.totalTasks || 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>En Progreso</span>
                <span className="font-mono">{metrics?.taskStatusBreakdown?.in_progress || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((metrics?.taskStatusBreakdown?.in_progress || 0) /
                        (metrics?.totalTasks || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>En Revisión</span>
                <span className="font-mono">{metrics?.taskStatusBreakdown?.review || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((metrics?.taskStatusBreakdown?.review || 0) / (metrics?.totalTasks || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Completadas</span>
                <span className="font-mono">{metrics?.taskStatusBreakdown?.done || 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((metrics?.taskStatusBreakdown?.done || 0) / (metrics?.totalTasks || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear Organización */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Crear Nueva Organización</h3>
              <button
                onClick={() => setIsOrgModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrgSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nombre de la Organización
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="ej. Grupo Operativo del Este"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={orgDesc}
                  onChange={(e) => setOrgDesc(e.target.value)}
                  placeholder="Propósito y enfoque principal..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOrgModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                >
                  Guardar Organización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
