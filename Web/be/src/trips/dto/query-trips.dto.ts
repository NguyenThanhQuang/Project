import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class QueryTripsDto {
  @IsNotEmpty({ message: 'Điểm đi không được để trống' })
  @IsString()
  from: string;

  @IsNotEmpty({ message: 'Điểm đến không được để trống' })
  @IsString()
  to: string;

  @IsNotEmpty({ message: 'Ngày đi không được để trống' })
  @IsDateString({}, { message: 'Ngày đi không đúng định dạng YYYY-MM-DD' })
  date: string;

  passengers?: number;
}
