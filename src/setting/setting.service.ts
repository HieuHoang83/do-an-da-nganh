import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { IUser } from 'src/interface/users.interface';
import { UpdateSettingWithDevicesDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async createSetting(createSettingDto: CreateSettingDto, user: IUser) {
    const { timeStart, timeEnd, status } = createSettingDto;

    const setting = await this.prisma.setting.create({
      data: {
        timeStart,
        timeEnd,
        status,
        user: { connect: { id: user.id } }, // Liên kết với User
      },
    });

    return setting;
  }

  async addDevicesToSetting(
    settingId: string,
    devices: {
      deviceId: string;
      valueStart: number;
      valueEnd: number;
    }[],
  ) {
    if (!devices || devices.length === 0) return;

    await this.prisma.deviceSetting.createMany({
      data: devices.map((device) => ({
        settingId,
        deviceId: device.deviceId,
        valueStart: device.valueStart,
        valueEnd: device.valueEnd,
      })),
    });
  }

  async create(createSettingDto: CreateSettingDto, user: IUser) {
    const setting = await this.createSetting(createSettingDto, user);

    if (createSettingDto.devices && createSettingDto.devices.length > 0) {
      await this.addDevicesToSetting(setting.id, createSettingDto.devices);
    }

    return this.prisma.setting.findUnique({
      where: { id: setting.id },
      include: { devices: true }, // Trả về setting với danh sách thiết bị đã liên kết
    });
  }

  async findByUser(userId: string) {
    return await this.prisma.setting.findMany({
      where: { userId },
      include: {
        devices: true, // Nếu muốn lấy kèm danh sách devices
      },
    });
  }
  async findByDevice(deviceId: string) {
    return this.prisma.setting.findMany({
      where: {
        devices: {
          some: { deviceId: deviceId },
        },
      },
      include: { devices: false }, // Nếu muốn lấy luôn thông tin thiết bị trong kết quả
    });
  }
  async findBySetting(settingId: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { id: settingId },
      include: { devices: true, user: false }, // Lấy thêm thông tin liên quan nếu cần
    });

    if (!setting) {
      throw new NotFoundException(
        `Không tìm thấy Setting với id: ${settingId}`,
      );
    }

    return setting;
  }
  async update(updateDto: UpdateSettingWithDevicesDto) {
    // Kiểm tra xem setting có tồn tại không
    const existingSetting = await this.prisma.setting.findUnique({
      where: { id: updateDto.settingId },
    });

    if (!existingSetting) {
      throw new NotFoundException(
        `Không tìm thấy Setting với ID: ${updateDto.settingId}`,
      );
    }

    // Cập nhật thông tin Setting
    const updatedSetting = await this.prisma.setting.update({
      where: { id: updateDto.settingId },
      data: {
        timeStart: updateDto.timeStart,
        timeEnd: updateDto.timeEnd,
        status: updateDto.status,
      },
    });

    let updatedDevices = [];

    // Nếu có danh sách DeviceSetting cần cập nhật
    if (updateDto.devices && updateDto.devices.length > 0) {
      // Lấy danh sách tất cả DeviceSetting hiện có để kiểm tra trước khi cập nhật
      const existingDevices = await this.prisma.deviceSetting.findMany({
        where: {
          DeviceSettingId: {
            in: updateDto.devices.map((d) => d.DeviceSettingId),
          },
        },
      });

      // Lọc ra những deviceSetting hợp lệ
      const validDevices = updateDto.devices.filter((device) =>
        existingDevices.some(
          (d) => d.DeviceSettingId === device.DeviceSettingId,
        ),
      );

      // Cập nhật danh sách hợp lệ
      updatedDevices = await Promise.all(
        validDevices.map((device) =>
          this.prisma.deviceSetting.update({
            where: { DeviceSettingId: device.DeviceSettingId },
            data: {
              valueStart: device.valueStart,
              valueEnd: device.valueEnd,
            },
          }),
        ),
      );
    }

    return {
      message: 'Cập nhật thành công',
      setting: updatedSetting,
      devices: updatedDevices, // Trả về danh sách deviceSetting đã cập nhật
    };
  }

  async remove(id: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }

    return this.prisma.setting.delete({
      where: { id },
    });
  }
}
