// src/modules/doctors/doctors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { DoctorRepository } from './doctor.repository';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { DoctorAvailabilityException } from './entities/doctor-availability-exception.entity';
import { DoctorClinic } from './entities/doctor-clinic.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorProfile,
      DoctorAvailability,
      DoctorAvailabilityException,
      DoctorClinic,
      Appointment,
      Payment,
    ]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorRepository],
  exports: [DoctorsService, DoctorRepository],
})
export class DoctorsModule {}