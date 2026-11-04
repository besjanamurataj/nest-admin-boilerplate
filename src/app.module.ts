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
import { StartupModule } from './auth/configs/startup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    // Connection settings come from environment variables (same names as base-springboot);
    // the defaults are the local development values
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get('REDIS_PORT', 6379)),
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_SERVER_IP', 'localhost'),
          port: Number(config.get('DB_PORT', 5432)),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'password'),
          database: config.get<string>('DB_NAME', 'mydb'),
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
    StartupModule,
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
