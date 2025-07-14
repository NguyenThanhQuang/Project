import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { MapsService } from './maps.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [MapsService],
  exports: [MapsService],
})
export class MapsModule {}
