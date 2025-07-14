import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MapsService {
  private readonly logger = new Logger(MapsService.name);
  private readonly OSRM_BASE_URL = 'http://router.project-osrm.org';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Lấy thông tin tuyến đường và polyline từ OSRM
   * @param coordinates Mảng các tọa độ [longitude, latitude]
   * @returns Chuỗi polyline được mã hóa
   */
  async getRoutePolyline(coordinates: [number, number][]): Promise<string> {
    if (!coordinates || coordinates.length < 2) {
      throw new BadRequestException('Cần ít nhất 2 tọa độ để tạo tuyến đường.');
    }

    const coordsString = coordinates.map((c) => c.join(',')).join(';');
    const url = `${this.OSRM_BASE_URL}/route/v1/driving/${coordsString}?overview=full&geometries=polyline`;

    this.logger.log(`Requesting route from OSRM: ${url}`);

    try {
      interface OsrmRouteResponse {
        code: string;
        routes: { geometry: string }[];
        [key: string]: any;
      }

      const response = await firstValueFrom(
        this.httpService.get<OsrmRouteResponse>(url),
      );

      if (
        response.data &&
        response.data.code === 'Ok' &&
        response.data.routes &&
        response.data.routes.length > 0
      ) {
        const polyline = response.data.routes[0].geometry;
        this.logger.log(`Successfully retrieved polyline.`);
        return polyline;
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
