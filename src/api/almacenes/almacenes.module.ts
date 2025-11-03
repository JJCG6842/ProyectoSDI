import { Module } from '@nestjs/common';
import { AlmacenesService } from './almacenes.service';
import { AlmacenesController } from './almacenes.controller';

@Module({
  providers: [AlmacenesService],
  controllers: [AlmacenesController]
})
export class AlmacenesModule {}
