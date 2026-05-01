import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
    PrimaryColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { DoctorAvailability } from './doctor-availability.entity';
  import { DoctorAvailabilityException } from './doctor-availability-exception.entity';
  import { DoctorClinic } from './doctor-clinic.entity';
  import { Appointment } from '../../appointments/entities/appointment.entity';
  import { Review } from '../../reviews/entities/review.entity';
  
  @Entity('doctor_profiles')
  export class DoctorProfile {
    @PrimaryColumn('uuid', { name: 'user_id' })
    userId: string;
  
    @Column()
    name: string;
  
    @Column()
    specialization: string;
  
    @Column({ name: 'experience_years', type: 'int', default: 0 })
    experienceYears: number;
  
    @Column({ name: 'max_appointments_per_day', type: 'int', default: 20 })
    maxAppointmentsPerDay: number;
  
    @Column({ name: 'booking_notice_hours', type: 'int', default: 24 })
    bookingNoticeHours: number;
  
    @Column({ name: 'cancellation_window_hrs', type: 'int', default: 24 })
    cancellationWindowHrs: number;
  
    @Column({ type: 'text', nullable: true })
    bio: string;
  
    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;
  
    @Column({ name: 'license_number', nullable: true })
    licenseNumber: string;
  
    @Column({ name: 'education', type: 'text', nullable: true })
    education: string;
  
    @Column({ name: 'languages', type: 'simple-array', nullable: true })
    languages: string[];
  
    @Column({ name: 'rating_average', type: 'decimal', precision: 2, scale: 1, default: 0 })
    ratingAverage: number;
  
    @Column({ name: 'total_reviews', type: 'int', default: 0 })
    totalReviews: number;
  
    @OneToOne(() => User, (user) => user.doctorProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @OneToMany(() => DoctorAvailability, (availability) => availability.doctor)
    availabilities: DoctorAvailability[];
  
    @OneToMany(() => DoctorAvailabilityException, (exception) => exception.doctor)
    availabilityExceptions: DoctorAvailabilityException[];
  
    @OneToMany(() => DoctorClinic, (dc) => dc.doctor)
    doctorClinics: DoctorClinic[];
  
    @OneToMany(() => Appointment, (appointment) => appointment.doctor)
    appointments: Appointment[];
  
    @OneToMany(() => Review, (review) => review.doctor)
    reviews: Review[];
  }