import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DoctorProfile } from './doctor-profile.entity';

@Entity('doctor_availability_exceptions')
export class DoctorAvailabilityException extends BaseEntity {
  @Column({ name: 'doctor_id', type: 'uuid' })
  doctorId: string;

  @Column({ name: 'exception_date', type: 'date' })
  exceptionDate: Date;

  @Column({ name: 'is_day_off', default: false })
  isDayOff: boolean;

  @Column({ name: 'override_start_time', type: 'time', nullable: true })
  overrideStartTime: string;

  @Column({ name: 'override_end_time', type: 'time', nullable: true })
  overrideEndTime: string;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => DoctorProfile, (profile) => profile.availabilityExceptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorProfile;
}
