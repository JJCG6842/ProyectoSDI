import { Module } from '@nestjs/common';
import { SalidaService } from './salida.service';
import { SalidaController } from './salida.controller';

@Module({
  providers: [SalidaService],
  controllers: [SalidaController]
})
export class SalidaModule {}
