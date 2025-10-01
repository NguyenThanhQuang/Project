import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    roles: UserRole[];
    companyId?: Types.ObjectId;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * [POST] /api/vehicles - Tạo một loại xe mới
   * Admin: có thể tạo cho bất kỳ công ty nào.
   * Company Admin: chỉ có thể tạo cho công ty của mình.
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { roles, companyId } = req.user;

    if (roles.includes(UserRole.COMPANY_ADMIN)) {
      if (
        !companyId ||
        createVehicleDto.companyId.toString() !== companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền tạo loại xe cho công ty của mình.',
        );
      }
    }

    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * [GET] /api/vehicles - Lấy danh sách các loại xe
   * Admin: có thể xem tất cả hoặc lọc theo companyId.
   * Company Admin: chỉ xem được các loại xe của công ty mình.
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  findAll(
    @Query('companyId') filterCompanyId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { roles, companyId } = req.user;

    if (roles.includes(UserRole.COMPANY_ADMIN)) {
      if (!companyId) {
        throw new ForbiddenException(
          'Tài khoản của bạn không được liên kết với nhà xe nào.',
        );
      }
      return this.vehiclesService.findAll(companyId);
    }

    return this.vehiclesService.findAll(filterCompanyId);
  }

  /**
   * [GET] /api/vehicles/:id - Lấy thông tin chi tiết một loại xe
   * Admin: xem bất kỳ.
   * Company Admin: chỉ xem được xe của công ty mình.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { roles, companyId } = req.user;
    const vehicle = await this.vehiclesService.findOne(id);

    if (roles.includes(UserRole.COMPANY_ADMIN)) {
      if (
        !companyId ||
        vehicle.companyId._id.toString() !== companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền xem loại xe của công ty mình.',
        );
      }
    }

    return vehicle;
  }

  /**
   * [PATCH] /api/vehicles/:id - Cập nhật thông tin loại xe
   * Admin: cập nhật bất kỳ.
   * Company Admin: chỉ cập nhật được xe của công ty mình.
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { roles, companyId } = req.user;
    const vehicleToUpdate = await this.vehiclesService.findOne(id);

    if (roles.includes(UserRole.COMPANY_ADMIN)) {
      if (
        !companyId ||
        vehicleToUpdate.companyId._id.toString() !== companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền cập nhật loại xe của công ty mình.',
        );
      }
      if (
        updateVehicleDto.companyId &&
        updateVehicleDto.companyId.toString() !== companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn không được phép thay đổi chủ sở hữu của loại xe.',
        );
      }
    }

    return this.vehiclesService.update(id, updateVehicleDto);
  }

  /**
   * [DELETE] /api/vehicles/:id - Xóa một loại xe
   * Admin: xóa bất kỳ.
   * Company Admin: chỉ xóa được xe của công ty mình.
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { roles, companyId } = req.user;
    const vehicleToDelete = await this.vehiclesService.findOne(id);

    if (roles.includes(UserRole.COMPANY_ADMIN)) {
      if (
        !companyId ||
        vehicleToDelete.companyId.toString() !== companyId.toString()
      ) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền xóa loại xe của công ty mình.',
        );
      }
    }

    return this.vehiclesService.remove(id);
  }
}
