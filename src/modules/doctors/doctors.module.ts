// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { DoctorProfile } from './entities/doctor-profile.entity';
// import { DoctorAvailability } from './entities/doctor-availability.entity';
// import { DoctorAvailabilityException } from './entities/doctor-availability-exception.entity';
// import { DoctorClinic } from './entities/doctor-clinic.entity';
// import { DoctorsService } from './doctors.service';
// import { DoctorsController } from './doctors.controller';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       DoctorProfile,
//       DoctorAvailability,
//       DoctorAvailabilityException,
//       DoctorClinic,
//     ]),
//   ],
//   controllers: [DoctorsController],
//   providers: [DoctorsService],
//   exports: [DoctorsService],
// })
// export class DoctorsModule {}