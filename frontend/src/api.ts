import { supabase } from './supabaseClient';

export const api = {
  // Auth
  login: async (email: string, password?: string) => {
    if (!email) {
      return { success: false, message: 'Email es requerido' };
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*, organization:organizations!fk_users_organization(*)')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (password && user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organization?.name,
      },
    };
  },

  // Users
  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*, organization:organizations!fk_users_organization(*)');
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data;
  },

  createUser: async (userData: any) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    return data;
  },

  getUserById: async (id: number | string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*, organization:organizations!fk_users_organization(*), managedProjects:projects!projects_managerId_fkey(*), assignedTasks:tasks!tasks_assigneeId_fkey(*)')
      .eq('id', Number(id))
      .maybeSingle();
    if (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
    return data;
  },

  // Organizations
  getOrganizations: async () => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*, users:users!fk_users_organization(*), projects:projects(*), adminOwner:users!organizations_adminOwnerId_fkey(*)');
    if (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }
    return data;
  },

  createOrganization: async (orgData: any) => {
    const { data, error } = await supabase
      .from('organizations')
      .insert([orgData])
      .select()
      .single();
    if (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
    return data;
  },

  deleteOrganization: async (id: number | string) => {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', Number(id));
    if (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
    return { success: true };
  },

  // Projects
  getProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, organization:organizations(*), manager:users!projects_managerId_fkey(*), tasks:tasks(*, assignee:users!tasks_assigneeId_fkey(*))');
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data;
  },

  getProjectById: async (id: number | string) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, organization:organizations(*), manager:users!projects_managerId_fkey(*), tasks:tasks(*, assignee:users!tasks_assigneeId_fkey(*))')
      .eq('id', Number(id))
      .maybeSingle();
    if (error) {
      console.error('Error fetching project by id:', error);
      return null;
    }
    return data;
  },

  createProject: async (projectData: any) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    return data;
  },

  deleteProject: async (id: number | string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', Number(id));
    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
    return { success: true };
  },

  // Tasks
  getTasks: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, project:projects(*), assignee:users!tasks_assigneeId_fkey(*)');
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    return data;
  },

  getTaskById: async (id: number | string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, project:projects(*), assignee:users!tasks_assigneeId_fkey(*)')
      .eq('id', Number(id))
      .maybeSingle();
    if (error) {
      console.error('Error fetching task by id:', error);
      return null;
    }
    return data;
  },

  createTask: async (taskData: any) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();
    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    return data;
  },

  updateTask: async (id: number | string, updatedData: any) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updatedData)
      .eq('id', Number(id))
      .select('*, project:projects(*), assignee:users!tasks_assigneeId_fkey(*)')
      .single();
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    return data;
  },

  deleteTask: async (id: number | string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', Number(id));
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
    return { success: true };
  },

  // Metrics
  getDashboardMetrics: async () => {
    const [
      { count: totalProjects },
      { count: totalTasks },
      { count: totalUsers },
      { count: totalOrganizations },
      { data: tasks },
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('organizations').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('status'),
    ]);

    const tasksList = tasks || [];
    const todoCount = tasksList.filter((t) => t.status === 'todo').length;
    const inProgressCount = tasksList.filter((t) => t.status === 'in_progress').length;
    const reviewCount = tasksList.filter((t) => t.status === 'review').length;
    const doneCount = tasksList.filter((t) => t.status === 'done').length;

    return {
      totalProjects: totalProjects ?? 0,
      totalTasks: totalTasks ?? 0,
      totalUsers: totalUsers ?? 0,
      totalOrganizations: totalOrganizations ?? 0,
      taskStatusBreakdown: {
        todo: todoCount,
        in_progress: inProgressCount,
        review: reviewCount,
        done: doneCount,
      },
    };
  },
};
