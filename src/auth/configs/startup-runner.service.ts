import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Authority } from 'src/authority/authority.entity';
import { Role } from 'src/roles/role.entity';
import { User } from 'src/users/user.entity';
import { AuthorityEnum } from 'src/authority/authority.enum';
import { DefaultRoleEnum } from 'src/roles/role.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StartupRunnerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StartupRunnerService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Checking initial setup');

    await this.dataSource.transaction(async (manager) => {
      const authorityRepository = manager.getRepository(Authority);
      const roleRepository = manager.getRepository(Role);
      const userRepository = manager.getRepository(User);

      // 1. Add missing authorities
      const appAuthorities: AuthorityEnum[] = Object.values(AuthorityEnum);

      for (const authorityName of appAuthorities) {
        const existingAuthority = await authorityRepository.findOne({
          where: { name: authorityName },
        });

        if (!existingAuthority) {
          await authorityRepository.save(
            authorityRepository.create({ name: authorityName }),
          );

          this.logger.log(`Authority ${authorityName} added`);
        }
      }

      // 2. Delete obsolete authorities
      const existingAuthorities = await authorityRepository.find();

      const authoritiesToDelete = existingAuthorities.filter(
        (authority) =>
          !appAuthorities.includes(authority.name as AuthorityEnum),
      );

      if (authoritiesToDelete.length > 0) {
        const deletedIds = authoritiesToDelete.map((authority) => authority.id);

        // Remove obsolete authorities from roles first
        const roles = await roleRepository.find({
          relations: { authorities: true },
        });

        for (const role of roles) {
          const originalLength = role.authorities.length;

          role.authorities = role.authorities.filter(
            (authority) => !deletedIds.includes(authority.id),
          );

          if (role.authorities.length !== originalLength) {
            await roleRepository.save(role);
          }
        }

        await authorityRepository.remove(authoritiesToDelete);

        for (const authority of authoritiesToDelete) {
          this.logger.warn(`Authority ${authority.name} deleted`);
        }
      }

      let adminRole = await roleRepository.findOne({
        where: { name: DefaultRoleEnum.ADMIN },
        relations: { authorities: true },
      });

      if (!adminRole) {
        adminRole = roleRepository.create({
          name: DefaultRoleEnum.ADMIN,
          authorities: [],
        });

        adminRole = await roleRepository.save(adminRole);
      }
      const allAuthorities = await authorityRepository.find();

      const existingAuthorityIds = new Set(
        adminRole.authorities.map((authority) => authority.id),
      );

      adminRole.authorities.push(
        ...allAuthorities.filter(
          (authority) => !existingAuthorityIds.has(authority.id),
        ),
      );

      const roleWithAllAuthorities = await roleRepository.save(adminRole);

      // 4. Create default admin user
      const existingAdmin = await userRepository.findOne({
        where: [{ email: 'admin@test.com' }],
      });

      if (!existingAdmin) {
        const password = this.configService.get<string>(
          'INITIAL_ADMIN_PASSWORD',
        );
        if (!password) {
          throw new Error('INITIAL_ADMIN_PASSWORD is not configured');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = userRepository.create({
          username: 'admin',
          name: 'Admin',
          surname: 'User',
          email: 'admin@test.com',
          password: hashedPassword,
          roles: [roleWithAllAuthorities],
        });

        await userRepository.save(admin);

        this.logger.log('Default admin user created');
      }

      this.logger.log('Finished initial setup');
    });
  }
}
