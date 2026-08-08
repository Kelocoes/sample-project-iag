export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  organizationId?: number;
  organizationName?: string;
  avatarUrl?: string;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  adminOwnerId?: number;
  adminOwner?: User;
  users?: User[];
  projects?: Project[];
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  status: string;
  budget?: number;
  organizationId?: number;
  organization?: Organization;
  managerId?: number;
  manager?: User;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  actualHours: number;
  dueDate?: string;
  projectId: number;
  project?: Project;
  assigneeId?: number;
  assignee?: User;
}

export interface DashboardMetrics {
  totalProjects: number;
  totalTasks: number;
  totalUsers: number;
  totalOrganizations: number;
  taskStatusBreakdown: {
    todo: number;
    in_progress: number;
    review: number;
    done: number;
  };
}
