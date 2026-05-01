import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { DoctorProfile } from './doctor-profile.entity';

@Entity('doctor_availabilities')
@Index(['doctorId', 'dayOfWeek'], { unique: true })
export class DoctorAvailability {
  @Column({ name: 'doctor_id', type: 'uuid', primary: true })
  doctorId: string;

  @Column({ name: 'day_of_week', type: 'int', primary: true })
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'slot_duration_mins', type: 'int', default: 30 })
  slotDurationMins: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => DoctorProfile, (profile) => profile.availabilities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorProfile;
}