import { Project } from './project.entity';
import { User } from './user.entity';
export declare enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    DONE = "done"
}
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    estimatedHours: number;
    actualHours: number;
    dueDate: string;
    project: Project;
    projectId: number;
    assignee: User;
    assigneeId: number;
    createdAt: Date;
    updatedAt: Date;
}
