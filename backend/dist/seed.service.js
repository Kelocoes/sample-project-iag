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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_entity_1 = require("./entities/organization.entity");
const user_entity_1 = require("./entities/user.entity");
const project_entity_1 = require("./entities/project.entity");
const task_entity_1 = require("./entities/task.entity");
let SeedService = class SeedService {
    orgRepo;
    userRepo;
    projectRepo;
    taskRepo;
    constructor(orgRepo, userRepo, projectRepo, taskRepo) {
        this.orgRepo = orgRepo;
        this.userRepo = userRepo;
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
    }
    async onApplicationBootstrap() {
        await this.taskRepo.query('DELETE FROM tasks');
        await this.projectRepo.query('DELETE FROM projects');
        await this.userRepo.query('DELETE FROM users');
        await this.orgRepo.query('DELETE FROM organizations');
        console.log('Seeding exactly 3 users (1 Admin, 2 Managers) and clean hierarchy...');
        const admin = await this.userRepo.save({
            email: 'admin@empresa.com',
            password: 'password123',
            name: 'Carlos Ruiz (Administrador)',
            role: user_entity_1.UserRole.ADMIN,
        });
        const manager1 = await this.userRepo.save({
            email: 'marta@empresa.com',
            password: 'password123',
            name: 'Marta Gómez (Manager Operaciones)',
            role: user_entity_1.UserRole.MANAGER,
        });
        const manager2 = await this.userRepo.save({
            email: 'david@empresa.com',
            password: 'password123',
            name: 'David Silva (Manager Servicio al Cliente)',
            role: user_entity_1.UserRole.MANAGER,
        });
        const org1 = await this.orgRepo.save({
            name: 'Corporativo Servicios del Norte',
            description: 'Organización principal de logística y eventos corporativos.',
            adminOwnerId: admin.id,
        });
        const org2 = await this.orgRepo.save({
            name: 'Alianzas Operativas del Sur',
            description: 'Organización de proyectos comerciales y atención al usuario.',
            adminOwnerId: admin.id,
        });
        await this.userRepo.update(admin.id, { organizationId: org1.id });
        await this.userRepo.update(manager1.id, { organizationId: org1.id });
        await this.userRepo.update(manager2.id, { organizationId: org2.id });
        const proj1 = await this.projectRepo.save({
            title: 'Organización del Evento Anual de Integración',
            description: 'Coordinación de proveedores, reserva de salón y menú para asistentes.',
            organizationId: org1.id,
            managerId: manager1.id,
            status: 'active',
            budget: 25000,
        });
        const proj2 = await this.projectRepo.save({
            title: 'Remodelación de la Recepción Principal',
            description: 'Compra de sillones, plantas decorativas y pintura del edificio.',
            organizationId: org1.id,
            managerId: manager1.id,
            status: 'active',
            budget: 14000,
        });
        const proj3 = await this.projectRepo.save({
            title: 'Campañas de Atención al Cliente',
            description: 'Llamadas de seguimiento mensual e informe de comentarios recibidos.',
            organizationId: org2.id,
            managerId: manager2.id,
            status: 'active',
            budget: 9500,
        });
        const tasksData = [
            {
                title: 'Llamar al banquete para confirmar el menú vegetariano',
                description: 'Validar cantidad de platos para el evento del fin de semana.',
                status: task_entity_1.TaskStatus.DONE,
                priority: task_entity_1.TaskPriority.HIGH,
                estimatedHours: 2,
                actualHours: 1,
                dueDate: '2026-08-12',
                projectId: proj1.id,
                assigneeId: manager1.id,
            },
            {
                title: 'Enviar correos con las invitaciones y mapa de llegada',
                description: 'Adjuntar itinerario del evento en formato PDF.',
                status: task_entity_1.TaskStatus.IN_PROGRESS,
                priority: task_entity_1.TaskPriority.MEDIUM,
                estimatedHours: 4,
                actualHours: 2,
                dueDate: '2026-08-18',
                projectId: proj1.id,
                assigneeId: admin.id,
            },
            {
                title: 'Pedir cotización de tres sillones para la sala de espera',
                description: 'Solicitar catálogo de precios con envío a domicilio incluido.',
                status: task_entity_1.TaskStatus.DONE,
                priority: task_entity_1.TaskPriority.MEDIUM,
                estimatedHours: 5,
                actualHours: 4,
                dueDate: '2026-08-10',
                projectId: proj2.id,
                assigneeId: manager1.id,
            },
            {
                title: 'Llamar a los 10 clientes principales del mes',
                description: 'Anotar comentarios de sugerencias y grado de satisfacción.',
                status: task_entity_1.TaskStatus.IN_PROGRESS,
                priority: task_entity_1.TaskPriority.HIGH,
                estimatedHours: 6,
                actualHours: 3,
                dueDate: '2026-08-19',
                projectId: proj3.id,
                assigneeId: manager2.id,
            },
            {
                title: 'Redactar informe en Word con las opiniones recibidas',
                description: 'Elaborar reporte sintético de 2 páginas.',
                status: task_entity_1.TaskStatus.TODO,
                priority: task_entity_1.TaskPriority.MEDIUM,
                estimatedHours: 4,
                actualHours: 0,
                dueDate: '2026-08-25',
                projectId: proj3.id,
                assigneeId: manager2.id,
            },
        ];
        for (const t of tasksData) {
            await this.taskRepo.save(t);
        }
        console.log('Seeded exactly 3 users (1 admin, 2 managers) and clean hierarchy!');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(3, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map