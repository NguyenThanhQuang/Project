import { IsNotEmpty, IsString } from 'class-validator';

export class CheckInTicketDto {
  @IsNotEmpty({ message: 'Mã vé không được để trống.' })
  @IsString()
  ticketCode: string;
}
