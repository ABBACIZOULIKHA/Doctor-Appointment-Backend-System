import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DoctorClinic } from '../../doctors/entities/doctor-clinic.entity';

@Entity('clinics')
export class Clinic extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'map_url', nullable: true })
  mapUrl: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'working_hours', type: 'jsonb', nullable: true })
  workingHours: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => DoctorClinic, (dc) => dc.clinic)
  doctorClinics: DoctorClinic[];
}