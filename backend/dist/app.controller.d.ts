import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { Organization } from './entities/organization.entity';
export declare class AppController {
    private userRepo;
    private projectRepo;
    private taskRepo;
    private orgRepo;
    constructor(userRepo: Repository<User>, projectRepo: Repository<Project>, taskRepo: Repository<Task>, orgRepo: Repository<Organization>);
    login(body: {
        email?: string;
        password?: string;
    }): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: {
            id: number;
            email: string;
            name: string;
            role: import("./entities/user.entity").UserRole;
            organizationId: number;
            organizationName: string;
        };
        message?: undefined;
    }>;
    getUsers(): Promise<User[]>;
    createUser(body: Partial<User>): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getOrganizations(): Promise<Organization[]>;
    createOrganization(body: Partial<Organization>): Promise<Organization>;
    getOrganizationById(id: string): Promise<Organization | null>;
    deleteOrganization(id: string): Promise<{
        success: boolean;
    }>;
    getProjects(): Promise<Project[]>;
    getProjectById(id: string): Promise<Project | null>;
    createProject(body: Partial<Project>): Promise<Project>;
    deleteProject(id: string): Promise<{
        success: boolean;
    }>;
    getTasks(): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    createTask(body: Partial<Task>): Promise<Task>;
    updateTask(id: string, body: Partial<Task>): Promise<Task | null>;
    deleteTask(id: string): Promise<{
        success: boolean;
    }>;
    getDashboardMetrics(): Promise<{
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
    }>;
}
