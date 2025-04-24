// create-setting.dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
class DeviceSettingDto {
  @IsNotEmpty({ message: 'deviceId không được để trống' })
  @IsString({ message: 'deviceId phải là chuỗi' })
  deviceId: string;

  @IsNotEmpty({ message: 'valueStart không được để trống' })
  @IsNumber({}, { message: 'valueStart phải là số' })
  valueStart: number;

  @IsNotEmpty({ message: 'valueEnd không được để trống' })
  @IsNumber({}, { message: 'valueEnd phải là số' })
  valueEnd: number;
}
export class CreateSettingDto {
  @IsNotEmpty({ message: 'timeStart không được để trống' })
  @IsDate({ message: 'timeStart phải là kiểu Date' })
  @Type(() => Date) // ✅ Chuyển đổi từ chuỗi ISO thành Date
  timeStart: Date;

  @IsNotEmpty({ message: 'timeEnd không được để trống' })
  @IsDate({ message: 'timeEnd phải là kiểu Date' })
  @Type(() => Date) // ✅ Chuyển đổi từ chuỗi ISO thành Date
  timeEnd: Date;

  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsString({ message: 'Trạng thái phải là chuỗi' })
  status: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Phải có ít nhất một thiết bị' })
  @ValidateNested({ each: true })
  @Type(() => DeviceSettingDto)
  devices: DeviceSettingDto[];
}
