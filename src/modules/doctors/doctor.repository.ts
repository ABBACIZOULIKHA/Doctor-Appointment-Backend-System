// src/modules/doctors/repositories/doctor.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { DoctorAvailabilityException } from './entities/doctor-availability-exception.entity';
import { DoctorClinic } from './entities/doctor-clinic.entity';
import { Appointment } from './../appointments/entities/appointment.entity';
import { Payment } from './../payments/entities/payment.entity';
import { AppointmentStatus } from '../../common/enums/appointment-status.enum';

@Injectable()
export class DoctorRepository {
  constructor(
    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepo: Repository<DoctorProfile>,
    @InjectRepository(DoctorAvailability)
    private readonly availabilityRepo: Repository<DoctorAvailability>,
    @InjectRepository(DoctorAvailabilityException)
    private readonly exceptionRepo: Repository<DoctorAvailabilityException>,
    @InjectRepository(DoctorClinic)
    private readonly doctorClinicRepo: Repository<DoctorClinic>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async findProfileByUserId(userId: string): Promise<DoctorProfile | null> {
    return this.doctorProfileRepo.findOne({
      where: { userId },
      relations: ['availabilities', 'availabilityExceptions', 'doctorClinics', 'doctorClinics.clinic'],
    });
  }

  async createProfile(profile: Partial<DoctorProfile>): Promise<DoctorProfile> {
    const entity = this.doctorProfileRepo.create(profile);
    return this.doctorProfileRepo.save(entity);
  }

  async updateProfile(userId: string, update: Partial<DoctorProfile>): Promise<void> {
    await this.doctorProfileRepo.update({ userId }, update);
  }

  async findAvailability(doctorId: string, dayOfWeek: number): Promise<DoctorAvailability | null> {
    return this.availabilityRepo.findOne({ where: { doctorId, dayOfWeek } });
  }

  async findAllAvailabilities(doctorId: string): Promise<DoctorAvailability[]> {
    return this.availabilityRepo.find({ where: { doctorId } });
  }

  async saveAvailability(availability: Partial<DoctorAvailability>): Promise<DoctorAvailability> {
    const entity = this.availabilityRepo.create(availability);
    return this.availabilityRepo.save(entity);
  }

  async deleteAvailability(doctorId: string, dayOfWeek: number): Promise<void> {
    await this.availabilityRepo.delete({ doctorId, dayOfWeek });
  }

  async findExceptions(doctorId: string, startDate: Date, endDate: Date): Promise<DoctorAvailabilityException[]> {
    return this.exceptionRepo.find({
      where: {
        doctorId,
        exceptionDate: Between(startDate, endDate),
      },
    });
  }

  async createException(exception: Partial<DoctorAvailabilityException>): Promise<DoctorAvailabilityException> {
    const entity = this.exceptionRepo.create(exception);
    return this.exceptionRepo.save(entity);
  }

  async deleteException(exceptionId: string): Promise<void> {
    await this.exceptionRepo.delete(exceptionId);
  }

  async findDoctorClinics(doctorId: string): Promise<DoctorClinic[]> {
    return this.doctorClinicRepo.find({
      where: { doctorId },
      relations: ['clinic'],
    });
  }

  async updateClinicFee(doctorId: string, clinicId: string, fee: number): Promise<void> {
    await this.doctorClinicRepo.update({ doctorId, clinicId }, { consultationFee: fee });
  }

  async findAppointmentsByDoctor(
    doctorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: {
        doctorId,
        date: Between(startDate, endDate),
      },
      relations: ['patient', 'payment'],
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async findAppointmentById(appointmentId: string): Promise<Appointment | null> {
    return this.appointmentRepo.findOne({
      where: { id: appointmentId },
      relations: ['patient', 'doctor', 'payment'],
    });
  }

  async updateAppointmentStatus(appointmentId: string, status: string, notes?: string): Promise<void> {
    const update: any = { status };
    if (notes) update.notes = notes;
    await this.appointmentRepo.update(appointmentId, update);
  }

  async getAppointmentStats(doctorId: string, startDate: Date, endDate: Date) {
    const total = await this.appointmentRepo.count({
      where: { doctorId, date: Between(startDate, endDate) },
    });

    const completed = await this.appointmentRepo.count({
      where: { doctorId, date: Between(startDate, endDate), status: AppointmentStatus.COMPLETED },
    });

    const cancelled = await this.appointmentRepo.count({
      where: { doctorId, date: Between(startDate, endDate), status: AppointmentStatus.CANCELLED },
    });

    const noShow = await this.appointmentRepo.count({
      where: { doctorId, date: Between(startDate, endDate), status: AppointmentStatus.NO_SHOW },
    });

    return { total, completed, cancelled, noShow };
  }

  async getRevenueStats(doctorId: string, startDate: Date, endDate: Date) {
    const result = await this.paymentRepo
      .createQueryBuilder('payment')
      .innerJoin('payment.appointment', 'appointment')
      .where('appointment.doctorId = :doctorId', { doctorId })
      .andWhere('payment.status = :status', { status: 'paid' })
      .andWhere('appointment.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select('SUM(payment.amount)', 'totalRevenue')
      .addSelect('COUNT(payment.id)', 'totalPayments')
      .getRawOne();

    const pending = await this.paymentRepo
      .createQueryBuilder('payment')
      .innerJoin('payment.appointment', 'appointment')
      .where('appointment.doctorId = :doctorId', { doctorId })
      .andWhere('payment.status = :status', { status: 'pending' })
      .andWhere('appointment.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select('SUM(payment.amount)', 'pendingAmount')
      .addSelect('COUNT(payment.id)', 'pendingCount')
      .getRawOne();

    return {
      totalRevenue: parseFloat(result?.totalRevenue || 0),
      totalPayments: parseInt(result?.totalPayments || 0),
      pendingAmount: parseFloat(pending?.pendingAmount || 0),
      pendingCount: parseInt(pending?.pendingCount || 0),
    };
  }
}