import { Module } from '@nestjs/common';
import { OrdenesMantenimientoMaderaController } from './ordenes-mantenimiento-madera.controller';
import { OrdenesMantenimientoMaderaService } from './ordenes-mantenimiento-madera.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [OrdenesMantenimientoMaderaController],
  providers: [OrdenesMantenimientoMaderaService, PrismaService]
})
export class OrdenesMantenimientoMaderaModule {}
