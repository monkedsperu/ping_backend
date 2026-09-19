import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/persistence/prisma.module';
import { AuthModule } from './infrastructure/http/auth.module';
import { PingModule } from './infrastructure/http/ping.module';
import { UploadsModule } from './infrastructure/http/uploads.module';
import { UserModule } from './infrastructure/http/user.module';

@Module({
  imports: [PrismaModule, AuthModule, PingModule, UploadsModule, UserModule],
})
export class AppModule {}
