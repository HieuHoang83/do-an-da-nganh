import {
  IsOptional,
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDeviceSettingDto } from './update-diviceSetting';

export class UpdateSettingWithDevicesDto {
  @IsNotEmpty({ message: 'settingId không được để trống' })
  @IsString({ message: 'settingId phải là chuỗi' })
  settingId?: string;

  @IsOptional()
  @IsDate({ message: 'timeStart phải là kiểu Date' })
  @Type(() => Date)
  timeStart?: Date;

  @IsOptional()
  @IsDate({ message: 'timeEnd phải là kiểu Date' })
  @Type(() => Date)
  timeEnd?: Date;

  @IsOptional()
  @IsString({ message: 'Trạng thái phải là chuỗi' })
  status?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDeviceSettingDto)
  devices?: UpdateDeviceSettingDto[]; // ✅ Danh sách thiết bị cần cập nhật
}
