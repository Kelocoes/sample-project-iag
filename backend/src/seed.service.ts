import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { User, UserRole } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async onApplicationBootstrap() {
    await this.taskRepo.query('DELETE FROM tasks');
    await this.projectRepo.query('DELETE FROM projects');
    await this.userRepo.query('DELETE FROM users');
    await this.orgRepo.query('DELETE FROM organizations');

    console.log('Seeding exactly 3 users (1 Admin, 2 Managers) and clean hierarchy...');

    // 1. Create Exactly 3 Users
    const admin = await this.userRepo.save({
      email: 'admin@empresa.com',
      password: 'password123',
      name: 'Carlos Ruiz (Administrador)',
      role: UserRole.ADMIN,
    });

    const manager1 = await this.userRepo.save({
      email: 'marta@empresa.com',
      password: 'password123',
      name: 'Marta Gómez (Manager Operaciones)',
      role: UserRole.MANAGER,
    });

    const manager2 = await this.userRepo.save({
      email: 'david@empresa.com',
      password: 'password123',
      name: 'David Silva (Manager Servicio al Cliente)',
      role: UserRole.MANAGER,
    });

    // 2. Create 2 Organizations managed by Admin
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

    // 3. Create Projects assigned to Managers
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

    // 4. Create Simple Tasks assigned to managers/admin
    const tasksData = [
      {
        title: 'Llamar al banquete para confirmar el menú vegetariano',
        description: 'Validar cantidad de platos para el evento del fin de semana.',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        estimatedHours: 2,
        actualHours: 1,
        dueDate: '2026-08-12',
        projectId: proj1.id,
        assigneeId: manager1.id,
      },
      {
        title: 'Enviar correos con las invitaciones y mapa de llegada',
        description: 'Adjuntar itinerario del evento en formato PDF.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        estimatedHours: 4,
        actualHours: 2,
        dueDate: '2026-08-18',
        projectId: proj1.id,
        assigneeId: admin.id,
      },
      {
        title: 'Pedir cotización de tres sillones para la sala de espera',
        description: 'Solicitar catálogo de precios con envío a domicilio incluido.',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        estimatedHours: 5,
        actualHours: 4,
        dueDate: '2026-08-10',
        projectId: proj2.id,
        assigneeId: manager1.id,
      },
      {
        title: 'Llamar a los 10 clientes principales del mes',
        description: 'Anotar comentarios de sugerencias y grado de satisfacción.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        estimatedHours: 6,
        actualHours: 3,
        dueDate: '2026-08-19',
        projectId: proj3.id,
        assigneeId: manager2.id,
      },
      {
        title: 'Redactar informe en Word con las opiniones recibidas',
        description: 'Elaborar reporte sintético de 2 páginas.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
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
}
