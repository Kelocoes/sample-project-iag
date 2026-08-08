import { User } from './user.entity';
import { Project } from './project.entity';
export declare class Organization {
    id: number;
    name: string;
    description: string;
    adminOwner: User;
    adminOwnerId: number;
    users: User[];
    projects: Project[];
    createdAt: Date;
    updatedAt: Date;
}
