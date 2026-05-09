// src/modules/doctors/dto/update-appointment-status.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '../../../common/enums/appointment-status.enum';

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}