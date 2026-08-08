import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [Organization, User, Project, Task],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Organization, User, Project, Task]),
  ],
  controllers: [AppController],
  providers: [SeedService],
})
export class AppModule {}
