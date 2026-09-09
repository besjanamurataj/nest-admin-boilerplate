import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { ReportsModule } from './reports/reports.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Authority } from './authority/authority.entity';
import { UserInfo } from './userInfo/userInfo.entity';
import { AuthorityModule } from './authority/authorities.module';

import { BullModule } from '@nestjs/bull';
import { BatchModule } from './batch/batch.module';
import { Department } from './departments/department.entity';
import { Student } from './students/student.entity';
import { University } from './universities/university.entity';
import { DepartmentModule } from './departments/departments.module';
import { UniversitiesModule } from './universities/universities.module';
import { StudentsModule } from './students/students.module';
import { Enrollment } from './enrollments/enrollment.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, BatchModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'sogetelpostgres',
          database: 'mydb',
          entities: [
            User,
            Role,
            Authority,
            UserInfo,
            University,
            Department,
            Student,
            Enrollment,
          ],
          synchronize: true,
        };
      },
    }),

    UserModule,
    ReportsModule,
    RolesModule,
    UniversitiesModule,
    DepartmentModule,
    StudentsModule,
    EnrollmentsModule,
    AuthModule,
    AuthorityModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
