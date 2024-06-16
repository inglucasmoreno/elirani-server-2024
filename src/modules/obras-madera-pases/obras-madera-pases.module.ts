import { Module } from '@nestjs/common';
import { ObrasMaderaPasesController } from './obras-madera-pases.controller';
import { ObrasMaderaPasesService } from './obras-madera-pases.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ObrasMaderaPasesController],
  providers: [ObrasMaderaPasesService, PrismaService]
})
export class ObrasMaderaPasesModule {}
