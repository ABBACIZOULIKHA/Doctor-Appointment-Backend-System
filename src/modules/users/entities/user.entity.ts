import {
    Entity,
    Column,
    OneToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  import { UserStatus } from '../../../common/enums/user-status.enum';
  import { UserRole } from '../../auth/entities/user-role.entity';
  import { PatientProfile } from '../../patients/entities/patient-profile.entity';
  import { DoctorProfile } from '../../doctors/entities/doctor-profile.entity';
  import { Notification } from '../../notifications/entities/notification.entity';
  import { File } from '../../files/entities/file.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid', { name: '_id' })
    _id: string;
  
    @Column({ unique: true })
    @Index()
    email: string;
  
    @Column({ nullable: true })
    phone: string;  // ✅ Removed | null
  
    @Column({ name: 'password_hash' })
    passwordHash: string;
  
    @Column({ name: 'refresh_token_hash', nullable: true })
    refreshTokenHash: string;  // ✅ Removed | null
  
    @Column({ name: 'refresh_token_expires_at', type: 'timestamp', nullable: true })
    refreshTokenExpiresAt: Date;  // ✅ Removed | null
  
    @Column({
      type: 'enum',
      enum: UserStatus,
      default: UserStatus.PENDING_VERIFICATION,
    })
    status: UserStatus;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    @OneToMany(() => UserRole, (role) => role.user, { cascade: true })
    roles: UserRole[];
  
    @OneToOne(() => PatientProfile, (profile) => profile.user)
    patientProfile: PatientProfile;
  
    @OneToOne(() => DoctorProfile, (profile) => profile.user)
    doctorProfile: DoctorProfile;
  
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
  
    @OneToMany(() => File, (file) => file.user)
    files: File[];
  }