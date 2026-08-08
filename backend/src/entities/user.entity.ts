import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'text', default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Organization, (org) => org.adminOwner)
  ownedOrganizations: Organization[];

  @ManyToOne(() => Organization, (org) => org.users, { onDelete: 'SET NULL', nullable: true })
  organization: Organization;

  @Column({ nullable: true })
  organizationId: number;

  @OneToMany(() => Project, (project) => project.manager)
  managedProjects: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
