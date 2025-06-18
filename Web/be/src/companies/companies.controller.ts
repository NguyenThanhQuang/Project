import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: UserRole;
    companyId?: Types.ObjectId;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  /**
   * [POST] /api/companies - Tạo một nhà xe mới
   * Chỉ dành cho Admin.
   */
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  /**
   * [GET] /api/companies - Lấy danh sách tất cả các nhà xe
   * Chỉ dành cho Admin.
   */
  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.companiesService.findAll();
  }

  /**
   * [GET] /api/companies/my-company - Lấy thông tin công ty của Company Admin đang đăng nhập
   * Dành cho Company Admin.
   */
  @Get('my-company')
  @Roles(UserRole.COMPANY_ADMIN)
  getMyCompany(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    if (!companyId) {
      throw new ForbiddenException(
        'Tài khoản của bạn không được liên kết với nhà xe nào.',
      );
    }
    return this.companiesService.findOne(companyId);
  }

  /**
   * [GET] /api/companies/:id - Lấy thông tin chi tiết một nhà xe bằng ID
   * Dành cho Admin (xem bất kỳ) hoặc Company Admin (chỉ xem công ty của mình).
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const { role, companyId } = req.user;

    if (role === UserRole.COMPANY_ADMIN) {
      if (!companyId || companyId.toString() !== id) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền xem thông tin của công ty mình.',
        );
      }
    }

    return this.companiesService.findOne(id);
  }

  /**
   * [PATCH] /api/companies/:id - Cập nhật thông tin nhà xe
   * Dành cho Admin (cập nhật bất kỳ) hoặc Company Admin (chỉ cập nhật công ty của mình).
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { role, companyId } = req.user;

    if (role === UserRole.COMPANY_ADMIN) {
      if (!companyId || companyId.toString() !== id) {
        throw new ForbiddenException(
          'Bạn chỉ có quyền cập nhật thông tin của công ty mình.',
        );
      }
    }

    return this.companiesService.update(id, updateCompanyDto);
  }

  /**
   * [DELETE] /api/companies/:id - Xóa một nhà xe
   * Chỉ dành cho Admin.
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
