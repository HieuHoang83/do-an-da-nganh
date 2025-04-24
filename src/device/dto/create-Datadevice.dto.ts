// create-device.dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class CreateDataDeviceDto {
  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNumber()
  value: number;
}
