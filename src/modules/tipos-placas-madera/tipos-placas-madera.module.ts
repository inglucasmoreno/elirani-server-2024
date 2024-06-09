import { Module } from '@nestjs/common';
import { TiposPlacasMaderaController } from './tipos-placas-madera.controller';
import { TiposPlacasMaderaService } from './tipos-placas-madera.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TiposPlacasMaderaController],
  providers: [TiposPlacasMaderaService, PrismaService]
})
export class TiposPlacasMaderaModule {}
