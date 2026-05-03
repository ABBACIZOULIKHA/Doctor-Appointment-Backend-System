import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
// import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
// import { PatientsModule } from './modules/patients/patients.module';
// import { DoctorsModule } from './modules/doctors/doctors.module';
// import { ClinicsModule } from './modules/clinics/clinics.module';
// import { AppointmentsModule } from './modules/appointments/appointments.module';
// import { PaymentsModule } from './modules/payments/payments.module';
// import { ReviewsModule } from './modules/reviews/reviews.module';
// import { NotificationsModule } from './modules/notifications/notifications.module';
// import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    // UsersModule,
    // PatientsModule,
    // DoctorsModule,
    // ClinicsModule,
    // AppointmentsModule,
    // PaymentsModule,
    // ReviewsModule,
    // NotificationsModule,
    // FilesModule,
  ],
})
export class AppModule {}
