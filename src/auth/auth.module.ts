import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './configs/jwt-secret';
import { BatchModule } from 'src/batch/batch.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule,BatchModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
      global: true,
    })
  ],

})
export class AuthModule {}
