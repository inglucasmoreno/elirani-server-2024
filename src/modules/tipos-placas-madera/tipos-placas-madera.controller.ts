import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TiposPlacasMaderaService } from './tipos-placas-madera.service';
import { Prisma } from '@prisma/client';

@Controller('tipos-placas-madera')
export class TiposPlacasMaderaController {

  constructor(private readonly tiposPlacasMaderaService: TiposPlacasMaderaService){}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getId(@Res() res, @Param('id') id: number): Promise<any> {

    const tipo = await this.tiposPlacasMaderaService.getId(id);
    
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Tipo obtenido correctamente',
      tipo   
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    
    const {tipos, totalItems} = await this.tiposPlacasMaderaService.getAll(query);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Tipos obtenidos correctamente',
      tipos,
      totalItems   
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Res() res, @Body() createData: Prisma.TiposPlacasMaderaCreateInput): Promise<any> {

    const tipo = await this.tiposPlacasMaderaService.insert(createData);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Tipo creado correctamente',
      tipo
    })
  
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() dataUpdate: Prisma.TiposPlacasMaderaUpdateInput){

    const tipo = await this.tiposPlacasMaderaService.update(id, dataUpdate);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Tipo actualizado correctamente',
      tipo
    })

  }

}
