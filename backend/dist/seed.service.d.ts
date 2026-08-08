import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private orgRepo;
    private userRepo;
    private projectRepo;
    private taskRepo;
    constructor(orgRepo: Repository<Organization>, userRepo: Repository<User>, projectRepo: Repository<Project>, taskRepo: Repository<Task>);
    onApplicationBootstrap(): Promise<void>;
}
