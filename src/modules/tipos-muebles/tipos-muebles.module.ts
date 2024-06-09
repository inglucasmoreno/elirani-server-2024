import { Module } from '@nestjs/common';
import { TiposMueblesController } from './tipos-muebles.controller';
import { TiposMueblesService } from './tipos-muebles.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TiposMueblesController],
  providers: [TiposMueblesService, PrismaService]
})
export class TiposMueblesModule {}
