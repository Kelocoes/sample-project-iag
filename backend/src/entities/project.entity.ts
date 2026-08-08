import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'integer', default: 15000 })
  budget: number;

  @ManyToOne(() => Organization, (org) => org.projects, { onDelete: 'CASCADE' })
  organization: Organization;

  @Column({ nullable: true })
  organizationId: number;

  @ManyToOne(() => User, (user) => user.managedProjects, { onDelete: 'SET NULL', nullable: true })
  manager: User;

  @Column({ nullable: true })
  managerId: number;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
