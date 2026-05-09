// src/modules/doctors/dto/create-exception.dto.ts
import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateExceptionDto {
  @IsDateString()
  exceptionDate: string;

  @IsBoolean()
  isDayOff: boolean;

  @IsOptional()
  @IsString()
  overrideStartTime?: string;

  @IsOptional()
  @IsString()
  overrideEndTime?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}