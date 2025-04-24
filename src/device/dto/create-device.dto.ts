// create-device.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty({ message: 'Tên thiết bị không được để trống' })
  @IsString({ message: 'Tên thiết bị phải là chuỗi' })
  name: string;

  @IsNotEmpty({ message: 'Tên thiết bị không được để trống' })
  @IsString({ message: 'Tên thiết bị phải là chuỗi' })
  type: string;
}
