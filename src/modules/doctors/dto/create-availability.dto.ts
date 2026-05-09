// src/modules/doctors/dto/create-availability.dto.ts
import { IsInt, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateAvailabilityDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  slotDurationMins?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}