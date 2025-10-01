import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface RouteInfo {
  polyline: string;
  duration: number;
  distance: number;
}

@Injectable()
export class MapsService {
  private readonly logger = new Logger(MapsService.name);
  private readonly OSRM_BASE_URL = 'http://router.project-osrm.org';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Lấy thông tin tuyến đường (polyline, duration, distance) từ OSRM
   * @param coordinates Mảng các tọa độ [longitude, latitude]
   * @returns Một object chứa thông tin tuyến đường
   */
  async getRouteInfo(coordinates: [number, number][]): Promise<RouteInfo> {
    if (!coordinates || coordinates.length < 2) {
      throw new BadRequestException('Cần ít nhất 2 tọa độ để tạo tuyến đường.');
    }

    const coordsString = coordinates.map((c) => c.join(',')).join(';');
    const url = `${this.OSRM_BASE_URL}/route/v1/driving/${coordsString}?overview=full&geometries=polyline&annotations=duration,distance`;

    this.logger.log(`Requesting route from OSRM: ${url}`);

    try {
      interface OsrmRouteResponse {
        code: string;
        routes: {
          geometry: string;
          duration: number;
          distance: number;
        }[];
        [key: string]: any;
      }

      const response = await firstValueFrom(
        this.httpService.get<OsrmRouteResponse>(url),
      );

      const route = response.data?.routes?.[0];

      if (response.data?.code === 'Ok' && route) {
        const durationMultiplier =
          this.configService.get<number>('ROUTE_DURATION_MULTIPLIER') || 1.0;

        const adjustedDuration = Math.round(
          route.duration * durationMultiplier,
        );

        this.logger.log(
          `Successfully retrieved route. Original duration: ${route.duration}s. Multiplier: ${durationMultiplier}. Adjusted duration: ${adjustedDuration}s.`,
        );

        return {
          polyline: route.geometry,
          duration: adjustedDuration,
          distance: route.distance,
        };
      } else {
        this.logger.error(
          'OSRM API did not return a valid route.',
          response.data,
        );
        throw new InternalServerErrorException(
          'Không thể tạo tuyến đường từ các địa điểm đã cho.',
        );
      }
    } catch (error: unknown) {
      let errorMessage: any = '';
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: unknown }).response === 'object' &&
        (error as { response?: unknown }).response !== null &&
        (error as { response?: { data?: unknown } }).response !== undefined &&
        'data' in (error as { response: { data?: unknown } }).response
      ) {
        const errWithResponse = error as { response: { data?: unknown } };
        errorMessage = errWithResponse.response.data;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        errorMessage = (error as { message: string }).message;
      } else {
        errorMessage = error;
      }
      this.logger.error('Error calling OSRM API', errorMessage);
      throw new InternalServerErrorException('Lỗi kết nối đến dịch vụ bản đồ.');
    }
  }
}
