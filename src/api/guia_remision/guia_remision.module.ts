import { Module } from '@nestjs/common';
import { GuiaRemisionService } from './guia_remision.service';
import { GuiaRemisionController } from './guia_remision.controller';

@Module({
  providers: [GuiaRemisionService],
  controllers: [GuiaRemisionController]
})
export class GuiaRemisionModule {}
