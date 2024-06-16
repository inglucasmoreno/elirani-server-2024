import { Module } from '@nestjs/common';
import { MueblesController } from './muebles.controller';
import { MueblesService } from './muebles.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MueblesController],
  providers: [MueblesService, PrismaService]
})
export class MueblesModule {}
