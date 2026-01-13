import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignDriverDto {
  @IsNotEmpty({ message: 'ID tài xế không được để trống.' })
  @IsMongoId({ message: 'ID tài xế không hợp lệ.' })
  driverId: string;
}
