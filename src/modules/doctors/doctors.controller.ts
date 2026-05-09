// src/modules/doctors/doctors.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import type { Request } from 'express';
  import { DoctorsService } from './doctors.service';
  import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
  import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
  import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
  import { CreateAvailabilityDto } from './dto/create-availability.dto';
  import { CreateExceptionDto } from './dto/create-exception.dto';
  import { UpdateClinicFeeDto } from './dto/update-clinic-fee.dto';
  import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
  
  interface RequestWithUser extends Request {
    user: { sub: string };
  }
  
  @UseGuards(JwtAccessGuard)
  @Controller('doctors')
  export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}
  
    @Get('profile')
    getProfile(@Req() req: RequestWithUser) {
      return this.doctorsService.getProfile(req.user.sub);
    }
  
    @Post('profile')
    createProfile(
      @Req() req: RequestWithUser,
      @Body() dto: CreateDoctorProfileDto,
    ) {
      return this.doctorsService.createProfile(req.user.sub, dto);
    }
  
    @Put('profile')
    updateProfile(
      @Req() req: RequestWithUser,
      @Body() dto: UpdateDoctorProfileDto,
    ) {
      return this.doctorsService.updateProfile(req.user.sub, dto);
    }
  
    @Get('availability')
    getAvailability(@Req() req: RequestWithUser) {
      return this.doctorsService.getAvailability(req.user.sub);
    }
  
    @Post('availability')
    setAvailability(
      @Req() req: RequestWithUser,
      @Body() dto: CreateAvailabilityDto,
    ) {
      return this.doctorsService.setAvailability(req.user.sub, dto);
    }
  
    @Put('availability/:dayOfWeek')
    updateAvailability(
      @Req() req: RequestWithUser,
      @Param('dayOfWeek') dayOfWeek: string,
      @Body() dto: CreateAvailabilityDto,
    ) {
      return this.doctorsService.updateAvailability(req.user.sub, parseInt(dayOfWeek), dto);
    }
  
    @Delete('availability/:dayOfWeek')
    deleteAvailability(
      @Req() req: RequestWithUser,
      @Param('dayOfWeek') dayOfWeek: string,
    ) {
      return this.doctorsService.deleteAvailability(req.user.sub, parseInt(dayOfWeek));
    }
  
    @Get('exceptions')
    getExceptions(
      @Req() req: RequestWithUser,
      @Query('startDate') startDate: string,
      @Query('endDate') endDate: string,
    ) {
      return this.doctorsService.getExceptions(req.user.sub, startDate, endDate);
    }
  
    @Post('exceptions')
    createException(
      @Req() req: RequestWithUser,
      @Body() dto: CreateExceptionDto,
    ) {
      return this.doctorsService.createException(req.user.sub, dto);
    }
  
    @Delete('exceptions/:id')
    deleteException(
      @Req() req: RequestWithUser,
      @Param('id') exceptionId: string,
    ) {
      return this.doctorsService.deleteException(req.user.sub, exceptionId);
    }
  
    @Get('clinics')
    getClinics(@Req() req: RequestWithUser) {
      return this.doctorsService.getClinics(req.user.sub);
    }
  
    @Put('clinics/fee')
    updateClinicFee(
      @Req() req: RequestWithUser,
      @Body() dto: UpdateClinicFeeDto,
    ) {
      return this.doctorsService.updateClinicFee(req.user.sub, dto);
    }
  
    @Get('appointments')
    getAppointments(
      @Req() req: RequestWithUser,
      @Query('view') view: 'day' | 'week' | 'month',
      @Query('date') date: string,
    ) {
      return this.doctorsService.getAppointments(req.user.sub, view, date);
    }
  
    @Put('appointments/:id/status')
    updateAppointmentStatus(
      @Req() req: RequestWithUser,
      @Param('id') appointmentId: string,
      @Body() dto: UpdateAppointmentStatusDto,
    ) {
      return this.doctorsService.updateAppointmentStatus(req.user.sub, appointmentId, dto);
    }
  
    @Get('slots/:date')
    getAvailableSlots(
      @Req() req: RequestWithUser,
      @Param('date') date: string,
    ) {
      return this.doctorsService.getAvailableSlots(req.user.sub, date);
    }
  
    @Get('analytics')
    getAnalytics(
      @Req() req: RequestWithUser,
      @Query('period') period: 'week' | 'month' | 'year',
    ) {
      return this.doctorsService.getDashboardStats(req.user.sub, period);
    }
  }