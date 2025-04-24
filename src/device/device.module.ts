// device.module.ts
import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { NotifyService } from 'src/notify/notify.service';

@Module({
  imports: [PrismaModule],
  controllers: [DeviceController],
  providers: [DeviceService, NotifyService],
  exports: [DeviceService],
})
export class DeviceModule {}
