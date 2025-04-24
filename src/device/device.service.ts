import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateDataDeviceDto } from './dto/create-Datadevice.dto';

import { UpdateDeviceDto } from './dto/update-Datadevice.dto';
import { IUser } from 'src/interface/users.interface';
import { NotifyService } from 'src/notify/notify.service';

@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService,
    private notifyService: NotifyService,
  ) {}

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
        type: createDeviceDto.type,
        userId: user.id, // ✅ Lấy userId từ user đang đăng nhập (tránh truyền từ client)
      },
      include: { settings: true },
    });
  }
  async createDataDevice(
    user: IUser,
    createDataDeviceDto: CreateDataDeviceDto,
  ) {
    const { deviceId, value } = createDataDeviceDto;
    const now = new Date();

    // Tìm DeviceSetting có Setting còn hiệu lực và giá trị nằm trong khoảng

    const deviceSetting = await this.prisma.deviceSetting.findFirst({
      where: {
        deviceId,

        setting: {
          timeStart: { lte: now },
          timeEnd: { gte: now },
        },
      },
      include: {
        setting: true, // nếu bạn muốn lấy thêm thông tin setting
      },
    });

    let device = await this.findOne(createDataDeviceDto.deviceId);
    if (device.auto && deviceSetting) {
      let action = device.action;
      if (value < deviceSetting.valueStart) {
        action = true;
      } else if (action && value > deviceSetting.valueEnd) {
        action = false;
      }
      if (action !== device.action) {
        // Tạo notify
        device.action = action;
        await this.notifyService.create({
          message: `Thiết bị ${device.name} đã thay đổi trạng thái hoat động.`,
          userId: user.id,
        });
        await this.prisma.device.update({
          where: { id: device.id }, // Tìm thiết bị theo id
          data: {
            action: device.action, // Cập nhật trường 'action' của thiết bị
          },
          include: { settings: true }, // Bao gồm các cài đặt nếu cần
        });
      }
      // Lưu vào deviceData
      return this.prisma.deviceData.create({
        data: {
          deviceId,
          value,
          action,
        },
      });
    } else {
      return this.prisma.deviceData.create({
        data: {
          deviceId,
          value,
          action: device.action,
        },
      });
    }
    // Nếu không tìm được -> action = "none"
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
