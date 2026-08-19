import React, { useState, useEffect } from 'react';
import type { Task, User, Project } from '../types';
import { api } from '../api';
import { Plus, Clock, Calendar, User as UserIcon, Trash2, X, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';

export const KanbanView: React.FC = () => {
  const { taskId: taskIdParam } = useParams<{ taskId?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProjectId = searchParams.get('projectId');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterUser, setFilterUser] = useState<string>('all');
  const [activeOverColumn, setActiveOverColumn] = useState<string | null>(null);

  // Panel Form States
  const [panelTitle, setPanelTitle] = useState('');
  const [panelDescription, setPanelDescription] = useState('');
  const [panelStatus, setPanelStatus] = useState<Task['status']>('todo');
  const [panelPriority, setPanelPriority] = useState<Task['priority']>('medium');
  const [panelProjectId, setPanelProjectId] = useState<number>(1);
  const [panelAssigneeId, setPanelAssigneeId] = useState<number>(1);
  const [panelEstimatedHours, setPanelEstimatedHours] = useState(0);
  const [panelActualHours, setPanelActualHours] = useState(0);
  const [panelDueDate, setPanelDueDate] = useState('');

  // Create Modal Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProjectId, setNewProjectId] = useState<number>(1);
  const [newAssigneeId, setNewAssigneeId] = useState<number>(1);
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newEstimatedHours, setNewEstimatedHours] = useState(4);
  const [newDueDate, setNewDueDate] = useState('2026-08-30');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tasksData, projectsData, usersData] = await Promise.all([
        api.getTasks(),
        api.getProjects(),
        api.getUsers(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);

      if (projectsData.length > 0) {
        setNewProjectId(selectedProjectId ? parseInt(selectedProjectId, 10) : projectsData[0].id);
      }
      if (usersData.length > 0) {
        setNewAssigneeId(usersData[0].id);
      }
    } catch (error) {
      console.error('Error loading Kanban data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (taskIdParam && tasks.length > 0) {
      const numericId = parseInt(taskIdParam, 10);
      const found = tasks.find((t) => t.id === numericId);
      if (found) {
        setSelectedTask(found);
        setPanelTitle(found.title);
        setPanelDescription(found.description || '');
        setPanelStatus(found.status);
        setPanelPriority(found.priority);
        setPanelProjectId(found.projectId);
        setPanelAssigneeId(found.assigneeId || users[0]?.id || 1);
        setPanelEstimatedHours(found.estimatedHours || 0);
        setPanelActualHours(found.actualHours || 0);
        setPanelDueDate(found.dueDate || '');
      }
    } else if (!taskIdParam) {
      setSelectedTask(null);
    }
  }, [taskIdParam, tasks, users]);

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

  const handleTaskCardClick = (t: Task) => {
    const query = selectedProjectId ? `?projectId=${selectedProjectId}` : '';
    navigate(`/kanban/task/${t.id}${query}`);
  };

  const closeSidePanel = () => {
    setSelectedTask(null);
    const query = selectedProjectId ? `?projectId=${selectedProjectId}` : '';
    navigate(`/kanban${query}`);
  };

  const handleSavePanelDetails = () => {
    if (!selectedTask) return;
    handleUpdateTaskDetails(selectedTask.id, {
      title: panelTitle,
      description: panelDescription,
      status: panelStatus,
      priority: panelPriority,
      projectId: panelProjectId,
      assigneeId: panelAssigneeId,
      estimatedHours: panelEstimatedHours,
      actualHours: panelActualHours,
      dueDate: panelDueDate,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    handleCreateTask({
      title: newTitle,
      description: newDescription,
      status: 'todo',
      priority: newPriority,
      estimatedHours: newEstimatedHours,
      actualHours: 0,
      dueDate: newDueDate,
      projectId: newProjectId || projects[0]?.id || 1,
      assigneeId: newAssigneeId || users[0]?.id || 1,
    });

    setNewTitle('');
    setNewDescription('');
    setIsCreateModalOpen(false);
  };

  const handleProjectFilterSelect = (projId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (projId === 'all') {
      newParams.delete('projectId');
    } else {
      newParams.set('projectId', projId);
    }
    setSearchParams(newParams);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesProject = !selectedProjectId || t.projectId === parseInt(selectedProjectId, 10);
    const matchesUser = filterUser === 'all' || t.assigneeId === parseInt(filterUser, 10);
    return matchesProject && matchesUser;
  });

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'Por Hacer', color: 'border-slate-200' },
    { id: 'in_progress', title: 'En Progreso', color: 'border-amber-300' },
    { id: 'review', title: 'En Revisión', color: 'border-blue-300' },
    { id: 'done', title: 'Completado', color: 'border-emerald-300' },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('text/plain', taskId.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeOverColumn !== columnId) {
      setActiveOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setActiveOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    setActiveOverColumn(null);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr) {
      handleUpdateTaskStatus(parseInt(taskIdStr, 10), targetStatus);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500 space-y-3 font-sans">
        <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">Cargando tablero Kanban...</span>
      </div>
    );
  }

  return (
    <div className="relative flex w-full max-w-full gap-6 overflow-x-hidden">
      <div className="flex-1 space-y-6 min-w-0">
        {/* Filtros en Light Mode */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Proyecto
              </label>
              <select
                value={selectedProjectId || 'all'}
                onChange={(e) => handleProjectFilterSelect(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Todos los proyectos</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Asignado a
              </label>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Todos los miembros</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>

        {/* Tablero Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-full">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            const isOver = activeOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`bg-slate-100/60 border ${
                  isOver ? 'border-indigo-500 bg-indigo-50/50' : col.color
                } rounded-xl p-4 space-y-4 flex flex-col min-h-[550px] w-full transition-all duration-150`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="text-xs font-mono bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded shadow-xs">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  {columnTasks.map((t) => {
                    const isSelected = selectedTask?.id === t.id;
                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, t.id)}
                        onClick={() => handleTaskCardClick(t)}
                        className={`bg-white border p-4 rounded-xl space-y-3 shadow-xs transition-all group w-full cursor-pointer select-none ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                            : 'border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 break-words flex-1 leading-snug">
                            {t.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(t.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1 shrink-0"
                            title="Eliminar tarea sin confirmación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {t.description && (
                          <p className="text-[11px] text-slate-500 break-words leading-relaxed line-clamp-2">
                            {t.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 text-[10px] pt-1">
                          <span
                            className={`px-2 py-0.5 rounded font-mono uppercase font-medium ${
                              t.priority === 'urgent'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : t.priority === 'high'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {t.priority === 'low' ? 'Baja' : t.priority === 'medium' ? 'Media' : t.priority === 'high' ? 'Alta' : 'Urgente'}
                          </span>
                          <span className="text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {t.actualHours}/{t.estimatedHours}h
                          </span>
                          {t.dueDate && (
                            <span className="text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {t.dueDate}
                            </span>
                          )}
                        </div>

                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center space-x-1.5 text-slate-600 min-w-0 flex-1">
                            <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {t.assignee?.name || 'Sin asignar'}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel Lateral Jira Light Mode */}
      {selectedTask && (
        <aside className="w-96 shrink-0 bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-2xl flex flex-col h-[calc(100vh-140px)] sticky top-24 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono uppercase font-bold">
                Tarea #{selectedTask.id}
              </span>
            </div>
            <button
              onClick={closeSidePanel}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Título de la Tarea
              </label>
              <input
                type="text"
                value={panelTitle}
                onChange={(e) => setPanelTitle(e.target.value)}
                onBlur={handleSavePanelDetails}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Estado Actual
              </label>
              <select
                value={panelStatus}
                onChange={(e) => {
                  const newSt = e.target.value as Task['status'];
                  setPanelStatus(newSt);
                  handleUpdateTaskStatus(selectedTask.id, newSt);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="todo">Por Hacer</option>
                <option value="in_progress">En Progreso</option>
                <option value="review">En Revisión</option>
                <option value="done">Completado</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Persona Asignada
              </label>
              <select
                value={panelAssigneeId}
                onChange={(e) => {
                  const newAssId = Number(e.target.value);
                  setPanelAssigneeId(newAssId);
                  handleUpdateTaskDetails(selectedTask.id, { assigneeId: newAssId });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Prioridad
                </label>
                <select
                  value={panelPriority}
                  onChange={(e) => {
                    const newPrio = e.target.value as Task['priority'];
                    setPanelPriority(newPrio);
                    handleUpdateTaskDetails(selectedTask.id, { priority: newPrio });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Proyecto
                </label>
                <select
                  value={panelProjectId}
                  onChange={(e) => {
                    const newProjId = Number(e.target.value);
                    setPanelProjectId(newProjId);
                    handleUpdateTaskDetails(selectedTask.id, { projectId: newProjId });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Estimadas</label>
                <input
                  type="number"
                  value={panelEstimatedHours}
                  onChange={(e) => setPanelEstimatedHours(Number(e.target.value))}
                  onBlur={handleSavePanelDetails}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Ejecutadas</label>
                <input
                  type="number"
                  value={panelActualHours}
                  onChange={(e) => setPanelActualHours(Number(e.target.value))}
                  onBlur={handleSavePanelDetails}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 uppercase mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={panelDueDate}
                  onChange={(e) => {
                    setPanelDueDate(e.target.value);
                    handleUpdateTaskDetails(selectedTask.id, { dueDate: e.target.value });
                  }}
                  className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Descripción Detallada
              </label>
              <textarea
                rows={5}
                value={panelDescription}
                onChange={(e) => setPanelDescription(e.target.value)}
                onBlur={handleSavePanelDetails}
                placeholder="Añade notas de seguimiento..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <button
              onClick={() => {
                handleDeleteTask(selectedTask.id);
                closeSidePanel();
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
              title="Eliminar tarea sin pedir confirmación"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Tarea</span>
            </button>

            <button
              onClick={handleSavePanelDetails}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          </div>
        </aside>
      )}

      {/* Modal Crear Nueva Tarea */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Crear Nueva Tarea</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Título de Tarea
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Llamar a proveedor o enviar informe"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalles sobre las acciones a realizar..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Proyecto
                  </label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Asignado a
                  </label>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Prioridad
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Estimación (h)
                  </label>
                  <input
                    type="number"
                    value={newEstimatedHours}
                    onChange={(e) => setNewEstimatedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Fecha Límite
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
