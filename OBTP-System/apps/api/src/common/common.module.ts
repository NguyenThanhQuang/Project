import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlBuilderService } from './utils/url-builder.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [UrlBuilderService],
  exports: [UrlBuilderService],
})
export class CommonModule {}
