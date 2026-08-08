import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { Organization } from './entities/organization.entity';

@Controller('api')
export class AppController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
  ) {}

  // --- AUTH ---
  @Post('auth/login')
  async login(@Body() body: { email?: string; password?: string }) {
    if (!body.email) {
      return { success: false, message: 'Email es requerido' };
    }
    const user = await this.userRepo.findOne({
      where: { email: body.email },
      relations: { organization: true },
    });

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    if (body.password && user.password !== body.password) {
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
  }

  // --- USERS ---
  @Get('users')
  async getUsers() {
    return this.userRepo.find({ relations: { organization: true } });
  }

  @Post('users')
  async createUser(@Body() body: Partial<User>) {
    const user = this.userRepo.create(body);
    return this.userRepo.save(user);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    const numId = parseInt(id, 10);
    return this.userRepo.findOne({
      where: { id: numId },
      relations: { organization: true, managedProjects: true, assignedTasks: true },
    });
  }

  // --- ORGANIZATIONS ---
  @Get('organizations')
  async getOrganizations() {
    return this.orgRepo.find({ relations: { users: true, projects: true, adminOwner: true } });
  }

  @Post('organizations')
  async createOrganization(@Body() body: Partial<Organization>) {
    const org = this.orgRepo.create(body);
    return this.orgRepo.save(org);
  }

  @Get('organizations/:id')
  async getOrganizationById(@Param('id') id: string) {
    const numId = parseInt(id, 10);
    return this.orgRepo.findOne({
      where: { id: numId },
      relations: { users: true, projects: true, adminOwner: true },
    });
  }

  @Delete('organizations/:id')
  async deleteOrganization(@Param('id') id: string) {
    const numId = parseInt(id, 10);
    await this.orgRepo.delete(numId);
    return { success: true };
  }

  // --- PROJECTS ---
  @Get('projects')
  async getProjects() {
    return this.projectRepo.find({
      relations: { organization: true, manager: true, tasks: { assignee: true } },
    });
  }

  @Get('projects/:id')
  async getProjectById(@Param('id') id: string) {
    const numId = parseInt(id, 10);
    return this.projectRepo.findOne({
      where: { id: numId },
      relations: { organization: true, manager: true, tasks: { assignee: true } },
    });
  }

  @Post('projects')
  async createProject(@Body() body: Partial<Project>) {
    const project = this.projectRepo.create(body);
    return this.projectRepo.save(project);
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    const numId = parseInt(id, 10);
    await this.projectRepo.delete(numId);
    return { success: true };
  }

  // --- TASKS ---
  @Get('tasks')
  async getTasks() {
    return this.taskRepo.find({
      relations: { project: true, assignee: true },
    });
  }

  @Get('tasks/:id')
  async getTaskById(@Param('id') id: string) {
    const numId = parseInt(id, 10);
    return this.taskRepo.findOne({
      where: { id: numId },
      relations: { project: true, assignee: true },
    });
  }

  @Post('tasks')
  async createTask(@Body() body: Partial<Task>) {
    const task = this.taskRepo.create(body);
    return this.taskRepo.save(task);
  }

  @Patch('tasks/:id')
  async updateTask(@Param('id') id: string, @Body() body: Partial<Task>) {
    const numId = parseInt(id, 10);
    await this.taskRepo.update(numId, body);
    return this.taskRepo.findOne({
      where: { id: numId },
      relations: { project: true, assignee: true },
    });
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string) {
    const numId = parseInt(id, 10);
    await this.taskRepo.delete(numId);
    return { success: true };
  }

  // --- DASHBOARD METRICS ---
  @Get('dashboard/metrics')
  async getDashboardMetrics() {
    const totalProjects = await this.projectRepo.count();
    const totalTasks = await this.taskRepo.count();
    const totalUsers = await this.userRepo.count();
    const totalOrganizations = await this.orgRepo.count();
    
    const tasks = await this.taskRepo.find();
    const todoCount = tasks.filter((t) => t.status === 'todo').length;
    const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
    const reviewCount = tasks.filter((t) => t.status === 'review').length;
    const doneCount = tasks.filter((t) => t.status === 'done').length;

    return {
      totalProjects,
      totalTasks,
      totalUsers,
      totalOrganizations,
      taskStatusBreakdown: {
        todo: todoCount,
        in_progress: inProgressCount,
        review: reviewCount,
        done: doneCount,
      },
    };
  }
}
