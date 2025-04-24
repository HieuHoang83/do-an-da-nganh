// update-device.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class UpdateDeviceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsDate()
  time?: Date;

  @IsOptional()
  @IsBoolean()
  auto?: boolean;

  @IsOptional()
  @IsBoolean()
  action?: boolean;
}
