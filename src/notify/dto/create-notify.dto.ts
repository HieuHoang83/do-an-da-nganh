import { IsString } from 'class-validator';

export class CreateNotifyDto {
  @IsString()
  message: string;

  @IsString()
  userId: string;
}
