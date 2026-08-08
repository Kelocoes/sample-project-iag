import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Task } from './task.entity';
export declare class Project {
    id: number;
    title: string;
    description: string;
    status: string;
    budget: number;
    organization: Organization;
    organizationId: number;
    manager: User;
    managerId: number;
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
}
