import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { DoctorProfile } from './doctor-profile.entity';
import { Clinic } from '../../clinics/entities/clinic.entity';

@Entity('doctor_clinics')
export class DoctorClinic {
  @PrimaryColumn('uuid', { name: 'doctor_id' })
  doctorId: string;

  @PrimaryColumn('uuid', { name: 'clinic_id' })
  clinicId: string;

  @Column({ name: 'consultation_fee', type: 'decimal', precision: 10, scale: 2 })
  consultationFee: number;

  @ManyToOne(() => DoctorProfile, (profile) => profile.doctorClinics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorProfile;

  @ManyToOne(() => Clinic, (clinic) => clinic.doctorClinics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;
}