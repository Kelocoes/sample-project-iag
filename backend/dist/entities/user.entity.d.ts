import { Organization } from './organization.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    ownedOrganizations: Organization[];
    organization: Organization;
    organizationId: number;
    managedProjects: Project[];
    assignedTasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
