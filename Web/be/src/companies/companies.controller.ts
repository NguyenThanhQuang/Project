import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CompanyStatus } from './schemas/company.schema';
import { AssignVehicleDto, UpdateDriverVehicleDto } from './dto/assign-vehicle.dto';


@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async findAll() {
    return this.companiesService.findAll();
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  async findAllWithStats() {
    return this.companiesService.findAllWithStats();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }

  @Get(':code/by-code')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async findOneByCode(@Param('code') code: string) {
    return this.companiesService.findOneByCode(code);
  }

  // ========== DRIVER MANAGEMENT ==========

  @Get(':id/drivers')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async getCompanyDrivers(
    @Param('id') companyId: string,
    @Query('status') status?: string,
    @Query('withVehicle', new DefaultValuePipe(false)) withVehicle?: boolean,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.companiesService.getCompanyDrivers(companyId, {
      status: status as any,
      withVehicle,
      page,
      limit,
      search,
    });
  }

  @Post(':id/drivers/assign-vehicle')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async assignVehicleToDriver(
    @Param('id') companyId: string,
    @Body() assignVehicleDto: AssignVehicleDto,
  ) {
    return this.companiesService.assignVehicleToDriver(
      companyId,
      assignVehicleDto.driverId,
      assignVehicleDto.vehicleId,
    );
  }

  @Put(':id/drivers/:driverId/vehicle')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async updateDriverVehicle(
    @Param('id') companyId: string,
    @Param('driverId') driverId: string,
    @Body() updateDto: UpdateDriverVehicleDto,
  ) {
    return this.companiesService.updateDriverVehicle(
      companyId,
      driverId,
      updateDto.newVehicleId,
    );
  }

  @Delete(':id/drivers/:driverId/vehicle')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVehicleFromDriver(
    @Param('id') companyId: string,
    @Param('driverId') driverId: string,
  ) {
    return this.companiesService.removeVehicleFromDriver(companyId, driverId);
  }

  @Get(':id/drivers/unassigned')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async getUnassignedDrivers(@Param('id') companyId: string) {
    return this.companiesService.getUnassignedDrivers(companyId);
  }

  @Get(':id/vehicles/available')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async getAvailableVehicles(
    @Param('id') companyId: string,
    @Query('excludeDriverId') excludeDriverId?: string,
  ) {
    return this.companiesService.getAvailableVehicles(
      companyId,
      excludeDriverId,
    );
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async getCompanyStats(@Param('id') companyId: string) {
    return this.companiesService.getCompanyStats(companyId);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CompanyStatus,
  ) {
    return this.companiesService.updateStatus(id, status);
  }

  @Delete()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    return this.companiesService.deleteAll();
  }
}