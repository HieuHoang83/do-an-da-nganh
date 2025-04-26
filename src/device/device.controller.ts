import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDataDeviceDto } from './dto/create-Datadevice.dto';
import { UpdateDeviceDto } from './dto/update-Datadevice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from 'src/interface/users.interface';

@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('/data')
  createDataDevice(
    @User() user: IUser,
    @Body() createDataDeviceDto: CreateDataDeviceDto,
  ) {
    return this.deviceService.createDataDevice(user, createDataDeviceDto);
  }
  @Patch('/:id')
  updateDevice(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.deviceService.updateDevice(id, updateDeviceDto);
  }
  @Post()
  createDevice(@Body() createDeviceDto: CreateDeviceDto, @User() user: IUser) {
    return this.deviceService.create(createDeviceDto, user);
  }
  @Get()
  findAll() {
    return this.deviceService.findAll();
  }
  @Get('user')
  findByUser(@User() user: IUser) {
    return this.deviceService.findByUser(user.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceService.remove(id);
  }
}
