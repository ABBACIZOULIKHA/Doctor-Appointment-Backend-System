// src/modules/doctors/dto/update-clinic-fee.dto.ts
import { IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateClinicFeeDto {
  @IsUUID()
  clinicId: string;

  @IsNumber()
  @Min(0)
  consultationFee: number;
}