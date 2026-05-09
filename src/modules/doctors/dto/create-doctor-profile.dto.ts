// src/modules/doctors/dto/create-doctor-profile.dto.ts
import { IsString, IsNumber, IsOptional, IsArray, Min, Max, Length } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  specialization: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAppointmentsPerDay?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bookingNoticeHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cancellationWindowHrs?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  languages?: string[];
}