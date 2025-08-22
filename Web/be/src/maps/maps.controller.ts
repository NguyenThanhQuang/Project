import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/schemas/user.schema';
import { CalculateRouteDto } from './dto/calculate-route.dto';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Post('calculate-route')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COMPANY_ADMIN)
  async calculateRoute(@Body() calculateRouteDto: CalculateRouteDto) {
    const coordinates: [number, number][] = calculateRouteDto.waypoints.map(
      (wp) => [wp.longitude, wp.latitude],
    );
    return this.mapsService.getRouteInfo(coordinates);
  }
}
