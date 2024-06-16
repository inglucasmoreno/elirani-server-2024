import { Module } from '@nestjs/common';
import { ObrasMaderaController } from './obras-madera.controller';
import { ObrasMaderaService } from './obras-madera.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ObrasMaderaController],
  providers: [ObrasMaderaService, PrismaService]
})
export class ObrasMaderaModule {}
