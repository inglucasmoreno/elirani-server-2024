import { Module } from '@nestjs/common';
import { ObrasMaderaMotivoPaseService } from './obras-madera-motivo-pase.service';
import { ObrasMaderaMotivoPaseController } from './obras-madera-motivo-pase.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ObrasMaderaMotivoPaseService, PrismaService],
  controllers: [ObrasMaderaMotivoPaseController]
})
export class ObrasMaderaMotivoPaseModule {}
