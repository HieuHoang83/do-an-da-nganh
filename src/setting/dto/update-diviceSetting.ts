import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateDeviceSettingDto {
  @IsNotEmpty({ message: 'DeviceSettingId không được để trống' })
  @IsString({ message: 'DeviceSettingId phải là chuỗi' })
  DeviceSettingId: string;

  @IsOptional()
  @IsNumber({}, { message: 'valueStart phải là số' })
  valueStart?: number;

  @IsOptional()
  @IsNumber({}, { message: 'valueEnd phải là số' })
  valueEnd?: number;
}
