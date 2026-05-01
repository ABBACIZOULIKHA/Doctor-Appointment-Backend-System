import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { FileEntityType } from '../../../common/enums/file-entity-type.enum';

@Entity('files')
export class File extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: FileEntityType,
  })
  entityType: FileEntityType;

  @Column({ name: 'entity_id' })
  entityId: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_type', nullable: true })
  fileType: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ name: 'uploaded_at' })
  uploadedAt: Date;

  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}