import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Project, Task } from '../types';
import { api } from '../api';
import { DollarSign, Clock, Users, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ProjectDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback direct path parsing if route param is missing
  const effectiveId = id || window.location.pathname.split('/project/')[1];

  useEffect(() => {
    if (effectiveId) {
      setLoading(true);
      Promise.all([api.getProjectById(effectiveId), api.getTasks()])
        .then(([projData, allTasks]) => {
          if (projData && !projData.error) {
            setProject(projData);
          } else {
            setProject(null);
          }
          if (Array.isArray(allTasks)) {
            setTasks(allTasks.filter((t: Task) => t.projectId === parseInt(effectiveId, 10)));
          }
        })
        .catch((err) => {
          console.error('Error al obtener el proyecto:', err);
          setProject(null);
        })
        .finally(() => setLoading(false));
    }
  }, [effectiveId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-sans">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Cargando información del proyecto #{effectiveId}...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 font-sans p-6 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full text-center space-y-3">
          <h2 className="text-lg font-bold text-slate-800">Proyecto #{effectiveId} no encontrado</h2>
          <p className="text-xs text-slate-500">
            El identificador proporcionado no existe en la base de datos o fue eliminado.
          </p>
          <button
            onClick={() => (window.location.href = '/projects')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Volver a la Lista de Proyectos
          </button>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalEstimatedHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const totalActualHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 space-y-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/projects';
                }
              }}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shadow-xs"
              title="Volver atrás"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono uppercase font-bold">
                  Proyecto #{project.id}
                </span>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase font-medium">
                  {project.status}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{project.title}</h1>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          {project.description}
        </p>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
              <span>Presupuesto</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              ${project.budget?.toLocaleString() || '15,000'} USD
            </div>
            <p className="text-[11px] text-slate-500">Monto asignado</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
              <span>Horas Invertidas</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {totalActualHours} / {totalEstimatedHours} h
            </div>
            <p className="text-[11px] text-slate-500">Ejecutadas vs Estimadas</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
              <span>Tareas Completadas</span>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {completedTasks} / {tasks.length}
            </div>
            <p className="text-[11px] text-slate-500">Entregables finalizados</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-1 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-semibold">
              <span>Manager Responsable</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-base font-bold text-slate-800 truncate">
              {project.manager?.name || 'Sin asignar'}
            </div>
            <p className="text-[11px] text-slate-500">Coordinador general</p>
          </div>
        </div>

        {/* Tareas registradas en el proyecto */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Tareas y Asignaciones del Proyecto
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Tarea</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Prioridad</th>
                  <th className="py-2.5 px-3">Asignado</th>
                  <th className="py-2.5 px-3">Horas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600">#{t.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{t.title}</td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono uppercase text-[10px]">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono uppercase text-[10px] ${
                          t.priority === 'urgent'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{t.assignee?.name || 'Sin asignar'}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {t.actualHours}/{t.estimatedHours}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
