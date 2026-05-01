import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
    PrimaryColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { MedicalHistory } from './medical-history.entity';
  import { Appointment } from '../../appointments/entities/appointment.entity';
  import { Review } from '../../reviews/entities/review.entity';
  
  @Entity('patient_profiles')
  export class PatientProfile {
    @PrimaryColumn('uuid', { name: 'user_id' })
    userId: string;
  
    @Column()
    name: string;
  
    @Column({ type: 'date', nullable: true })
    dob: Date;
  
    @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
    gender: string;
  
    @Column({ type: 'text', nullable: true })
    address: string;
  
    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;
  
    @Column({ name: 'emergency_contact_name', nullable: true })
    emergencyContactName: string;
  
    @Column({ name: 'emergency_contact_phone', nullable: true })
    emergencyContactPhone: string;
  
    @Column({ name: 'blood_type', nullable: true })
    bloodType: string;
  
    @Column({ type: 'text', nullable: true })
    allergies: string;
  
    @OneToOne(() => User, (user) => user.patientProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @OneToMany(() => MedicalHistory, (history) => history.patient)
    medicalHistories: MedicalHistory[];
  
    @OneToMany(() => Appointment, (appointment) => appointment.patient)
    appointments: Appointment[];
  
    @OneToMany(() => Review, (review) => review.patient)
    reviews: Review[];
  }