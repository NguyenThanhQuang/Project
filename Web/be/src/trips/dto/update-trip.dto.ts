import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTripDto extends PartialType(CreateTripDto) {
    @IsOptional()
    @IsBoolean()
    isRecurrenceTemplate?: boolean;
}
