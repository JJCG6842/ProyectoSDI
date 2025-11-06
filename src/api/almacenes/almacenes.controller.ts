import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  Patch
} from '@nestjs/common';
import { AlmacenesService } from './almacenes.service';

@Controller('almacenes')
export class AlmacenesController {
  
}