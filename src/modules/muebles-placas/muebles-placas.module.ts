import { Module } from '@nestjs/common';
import { MueblesPlacasController } from './muebles-placas.controller';
import { MueblesPlacasService } from './muebles-placas.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MueblesPlacasController],
  providers: [MueblesPlacasService, PrismaService]
})
export class MueblesPlacasModule {}
