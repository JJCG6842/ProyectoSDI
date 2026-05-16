import { Module } from '@nestjs/common';
import { AlmacenService } from './almacen.service';
import { AlmacenController } from './almacen.controller';

@Module({
  providers: [AlmacenService],
  controllers: [AlmacenController]
})
export class AlmacenModule {}
