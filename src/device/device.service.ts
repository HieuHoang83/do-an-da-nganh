import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateDataDeviceDto } from './dto/create-Datadevice.dto';

import { UpdateDeviceDto } from './dto/update-Datadevice.dto';
import { IUser } from 'src/interface/users.interface';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.device.findMany({
      include: { settings: true },
    });
  }

  async findOne(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: { settings: true },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return device;
  }

  async findByUser(userId: string) {
    return this.prisma.device.findMany({
      where: { userId },
      include: {
        data: true, // Join bảng DeviceData
      },
    });
  }

  async create(createDeviceDto: CreateDeviceDto, user: IUser) {
    return this.prisma.device.create({
      data: {
        name: createDeviceDto.name,
        userId: user.id, // ✅ Lấy userId từ user đang đăng nhập (tránh truyền từ client)
      },
      include: { settings: true },
    });
  }
  async createDataDevice(createDataDeviceDto: CreateDataDeviceDto) {
    const { deviceId, value } = createDataDeviceDto;

    // Tìm DeviceSetting phù hợp
    const deviceSetting = await this.prisma.deviceSetting.findFirst({
      where: {
        deviceId,
        valueStart: { lte: value }, // value >= valueStart
        valueEnd: { gte: value }, // value <= valueEnd
      },
    });

    if (!deviceSetting) {
      return this.prisma.deviceData.create({
        data: {
          ...createDataDeviceDto,
          action: 'none', // Gán action
        },
      });
    }

    // Gán action từ DeviceSetting
    return this.prisma.deviceData.create({
      data: {
        ...createDataDeviceDto,
        action: deviceSetting.action, // Gán action
      },
    });
  }
  async updateDevice(id: string, updateDeviceDto: UpdateDeviceDto) {
    const device = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
      include: { settings: true },
    });
  }

  async remove(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return this.prisma.device.delete({
      where: { id },
      include: { settings: true },
    });
  }
}
