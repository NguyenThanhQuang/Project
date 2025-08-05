import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UserRole } from '../users/schemas/user.schema';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * [PUBLIC] Lấy danh sách địa điểm phổ biến
   * @route GET /api/locations/popular
   */
  @Get('popular')
  findPopularLocations() {
    return this.locationsService.findPopularLocations();
  }
  /**
   * [PUBLIC] API tìm kiếm gợi ý địa điểm
   * @route GET /api/locations/search?q=keyword
   */
  @Get('search')
  searchLocations(@Query('q') keyword: string) {
    return this.locationsService.search(keyword);
  }

  /**
   * [PUBLIC] Lấy danh sách địa điểm (đổ dữ liệu cho dropdown)
   * @route GET /api/locations
   */
  @Get()
  findAllLocations(
    @Query('type') type?: string,
    @Query('province') province?: string,
  ) {
    const query: { type?: string; province?: RegExp } = {};
    if (type) query.type = type;
    if (province) query.province = new RegExp(province, 'i');
    return this.locationsService.findAll(query);
  }

  /**
   * [PUBLIC] Lấy chi tiết một địa điểm
   * @route GET /api/locations/:id
   */
  @Get(':id')
  findOneLocation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.locationsService.findOne(id);
  }

  // --- ADMIN ONLY ROUTES ---

  /**
   * [ADMIN] Tạo một địa điểm mới
   * @route POST /api/locations
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  /**
   * [ADMIN] Cập nhật một địa điểm
   * @route PATCH /api/locations/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateLocation(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  /**
   * [ADMIN] Xóa một địa điểm
   * @route DELETE /api/locations/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeLocation(@Param('id', ParseMongoIdPipe) id: string) {
    await this.locationsService.remove(id);
  }
}
