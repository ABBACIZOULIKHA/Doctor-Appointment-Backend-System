// src/modules/doctors/doctors.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { DoctorRepository } from './doctor.repository';
  import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
  import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
  import { CreateAvailabilityDto } from './dto/create-availability.dto';
  import { CreateExceptionDto } from './dto/create-exception.dto';
  import { UpdateClinicFeeDto } from './dto/update-clinic-fee.dto';
  import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
  import { AppointmentStatus } from '../../common/enums/appointment-status.enum';
  
  @Injectable()
  export class DoctorsService {
    constructor(private readonly doctorRepository: DoctorRepository) {}
  
    async getProfile(userId: string) {
      const profile = await this.doctorRepository.findProfileByUserId(userId);
      if (!profile) {
        throw new NotFoundException('Doctor profile not found');
      }
      return profile;
    }
  
    async createProfile(userId: string, dto: CreateDoctorProfileDto) {
      const existing = await this.doctorRepository.findProfileByUserId(userId);
      if (existing) {
        throw new BadRequestException('Profile already exists');
      }
  
      return this.doctorRepository.createProfile({
        userId,
        ...dto,
      });
    }
  
    async updateProfile(userId: string, dto: UpdateDoctorProfileDto) {
      const profile = await this.doctorRepository.findProfileByUserId(userId);
      if (!profile) {
        throw new NotFoundException('Doctor profile not found');
      }
  
      await this.doctorRepository.updateProfile(userId, dto);
      return this.getProfile(userId);
    }
  
    async getAvailability(userId: string) {
      return this.doctorRepository.findAllAvailabilities(userId);
    }
  
    async setAvailability(userId: string, dto: CreateAvailabilityDto) {
      const existing = await this.doctorRepository.findAvailability(userId, dto.dayOfWeek);
      if (existing) {
        throw new BadRequestException('Availability for this day already exists. Update instead.');
      }
  
      return this.doctorRepository.saveAvailability({
        doctorId: userId,
        ...dto,
      });
    }
  
    async updateAvailability(userId: string, dayOfWeek: number, dto: CreateAvailabilityDto) {
      const existing = await this.doctorRepository.findAvailability(userId, dayOfWeek);
      if (!existing) {
        throw new NotFoundException('Availability not found for this day');
      }
  
      return this.doctorRepository.saveAvailability({
        doctorId: userId,
        ...dto,
        dayOfWeek,
      });
    }
  
    async deleteAvailability(userId: string, dayOfWeek: number) {
      await this.doctorRepository.deleteAvailability(userId, dayOfWeek);
    }
  
    async getExceptions(userId: string, startDate: string, endDate: string) {
      return this.doctorRepository.findExceptions(
        userId,
        new Date(startDate),
        new Date(endDate),
      );
    }
  
    async createException(userId: string, dto: CreateExceptionDto) {
      return this.doctorRepository.createException({
        doctorId: userId,
        ...dto,
        exceptionDate: new Date(dto.exceptionDate),
      });
    }
  
    async deleteException(userId: string, exceptionId: string) {
      await this.doctorRepository.deleteException(exceptionId);
    }
  
    async getClinics(userId: string) {
      return this.doctorRepository.findDoctorClinics(userId);
    }
  
    async updateClinicFee(userId: string, dto: UpdateClinicFeeDto) {
      await this.doctorRepository.updateClinicFee(userId, dto.clinicId, dto.consultationFee);
      return this.getClinics(userId);
    }
  
    async getAppointments(
      userId: string,
      view: 'day' | 'week' | 'month',
      date: string,
    ) {
      const startDate = new Date(date);
      const endDate = new Date(date);
  
      if (view === 'week') {
        endDate.setDate(endDate.getDate() + 7);
      } else if (view === 'month') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setDate(endDate.getDate() + 1);
      }
  
      return this.doctorRepository.findAppointmentsByDoctor(userId, startDate, endDate);
    }
  
    async updateAppointmentStatus(
      userId: string,
      appointmentId: string,
      dto: UpdateAppointmentStatusDto,
    ) {
      const appointment = await this.doctorRepository.findAppointmentById(appointmentId);
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      if (appointment.doctorId !== userId) {
        throw new BadRequestException('Not authorized to update this appointment');
      }
  
      const update: any = { status: dto.status };
      if (dto.notes) update.notes = dto.notes;
      if (dto.status === AppointmentStatus.CANCELLED) {
        update.cancelledAt = new Date();
        if (dto.cancellationReason) update.cancellationReason = dto.cancellationReason;
      }
  
      await this.doctorRepository.updateAppointmentStatus(appointmentId, dto.status, dto.notes);
      return this.doctorRepository.findAppointmentById(appointmentId);
    }
  
    async getDashboardStats(userId: string, period: 'week' | 'month' | 'year') {
      const endDate = new Date();
      const startDate = new Date();
  
      if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
  
      const [appointmentStats, revenueStats] = await Promise.all([
        this.doctorRepository.getAppointmentStats(userId, startDate, endDate),
        this.doctorRepository.getRevenueStats(userId, startDate, endDate),
      ]);
  
      return {
        period,
        appointments: appointmentStats,
        revenue: revenueStats,
      };
    }
  
    async getAvailableSlots(userId: string, date: string) {
      const targetDate = new Date(date);
      const dayOfWeek = targetDate.getDay();
  
      const availability = await this.doctorRepository.findAvailability(userId, dayOfWeek);
      if (!availability || !availability.isActive) {
        return { slots: [] };
      }
  
      const exceptions = await this.doctorRepository.findExceptions(
        userId,
        targetDate,
        targetDate,
      );
  
      if (exceptions.length > 0 && exceptions[0].isDayOff) {
        return { slots: [], reason: 'Day off' };
      }
  
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const appointments = await this.doctorRepository.findAppointmentsByDoctor(
        userId,
        targetDate,
        nextDay,
      );
  
      const bookedSlots = appointments.map((a) => a.startTime);
  
      const slots = this.generateTimeSlots(
        availability.startTime,
        availability.endTime,
        availability.slotDurationMins,
        bookedSlots,
      );
  
      return {
        date,
        slots,
        totalSlots: slots.length,
        bookedSlots: bookedSlots.length,
      };
    }
  
    private generateTimeSlots(
      startTime: string,
      endTime: string,
      durationMins: number,
      bookedSlots: string[],
    ): Array<{ time: string; available: boolean }> {
      const slots: Array<{ time: string; available: boolean }> = [];
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
  
      let currentHour = startHour;
      let currentMin = startMin;
  
      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
      ) {
        const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        slots.push({
          time: timeStr,
          available: !bookedSlots.includes(timeStr),
        });
  
        currentMin += durationMins;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }
  
      return slots;
    }
  }