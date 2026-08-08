"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const project_entity_1 = require("./entities/project.entity");
const task_entity_1 = require("./entities/task.entity");
const organization_entity_1 = require("./entities/organization.entity");
let AppController = class AppController {
    userRepo;
    projectRepo;
    taskRepo;
    orgRepo;
    constructor(userRepo, projectRepo, taskRepo, orgRepo) {
        this.userRepo = userRepo;
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
        this.orgRepo = orgRepo;
    }
    async login(body) {
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
    async getUsers() {
        return this.userRepo.find({ relations: { organization: true } });
    }
    async createUser(body) {
        const user = this.userRepo.create(body);
        return this.userRepo.save(user);
    }
    async getUserById(id) {
        const numId = parseInt(id, 10);
        return this.userRepo.findOne({
            where: { id: numId },
            relations: { organization: true, managedProjects: true, assignedTasks: true },
        });
    }
    async getOrganizations() {
        return this.orgRepo.find({ relations: { users: true, projects: true, adminOwner: true } });
    }
    async createOrganization(body) {
        const org = this.orgRepo.create(body);
        return this.orgRepo.save(org);
    }
    async getOrganizationById(id) {
        const numId = parseInt(id, 10);
        return this.orgRepo.findOne({
            where: { id: numId },
            relations: { users: true, projects: true, adminOwner: true },
        });
    }
    async deleteOrganization(id) {
        const numId = parseInt(id, 10);
        await this.orgRepo.delete(numId);
        return { success: true };
    }
    async getProjects() {
        return this.projectRepo.find({
            relations: { organization: true, manager: true, tasks: { assignee: true } },
        });
    }
    async getProjectById(id) {
        const numId = parseInt(id, 10);
        return this.projectRepo.findOne({
            where: { id: numId },
            relations: { organization: true, manager: true, tasks: { assignee: true } },
        });
    }
    async createProject(body) {
        const project = this.projectRepo.create(body);
        return this.projectRepo.save(project);
    }
    async deleteProject(id) {
        const numId = parseInt(id, 10);
        await this.projectRepo.delete(numId);
        return { success: true };
    }
    async getTasks() {
        return this.taskRepo.find({
            relations: { project: true, assignee: true },
        });
    }
    async getTaskById(id) {
        const numId = parseInt(id, 10);
        return this.taskRepo.findOne({
            where: { id: numId },
            relations: { project: true, assignee: true },
        });
    }
    async createTask(body) {
        const task = this.taskRepo.create(body);
        return this.taskRepo.save(task);
    }
    async updateTask(id, body) {
        const numId = parseInt(id, 10);
        await this.taskRepo.update(numId, body);
        return this.taskRepo.findOne({
            where: { id: numId },
            relations: { project: true, assignee: true },
        });
    }
    async deleteTask(id) {
        const numId = parseInt(id, 10);
        await this.taskRepo.delete(numId);
        return { success: true };
    }
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('organizations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOrganizations", null);
__decorate([
    (0, common_1.Post)('organizations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createOrganization", null);
__decorate([
    (0, common_1.Get)('organizations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOrganizationById", null);
__decorate([
    (0, common_1.Delete)('organizations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteOrganization", null);
__decorate([
    (0, common_1.Get)('projects'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)('projects/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProjectById", null);
__decorate([
    (0, common_1.Post)('projects'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createProject", null);
__decorate([
    (0, common_1.Delete)('projects/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Get)('tasks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Get)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getTaskById", null);
__decorate([
    (0, common_1.Post)('tasks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createTask", null);
__decorate([
    (0, common_1.Patch)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Delete)('tasks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Get)('dashboard/metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getDashboardMetrics", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(3, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppController);
//# sourceMappingURL=app.controller.js.map