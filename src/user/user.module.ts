import { Module } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UsersModule {}
