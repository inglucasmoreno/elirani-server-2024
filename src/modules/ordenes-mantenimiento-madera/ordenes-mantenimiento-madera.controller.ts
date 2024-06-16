import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { OrdenesMantenimientoMaderaService } from './ordenes-mantenimiento-madera.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('ordenes-mantenimiento-madera')
export class OrdenesMantenimientoMaderaController {

  constructor(private readonly ordenesService: OrdenesMantenimientoMaderaService){}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getId(@Res() res, @Param('id') id: number): Promise<any> {

    const orden = await this.ordenesService.getId(id);
    
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Orden obtenida correctamente',
      orden
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    
    const {ordenes, totalItems} = await this.ordenesService.getAll(query);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Ordenes obtenidas correctamente',
      ordenes,
      totalItems   
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Res() res, @Body() createData: Prisma.OrdenesMantenimientoMaderaCreateInput): Promise<any> {

    const orden = await this.ordenesService.insert(createData);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Orden creada correctamente',
      orden
    })
  
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() dataUpdate: Prisma.OrdenesMantenimientoMaderaUpdateInput){

    const orden = await this.ordenesService.update(id, dataUpdate);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Orden actualizada correctamente',
      orden
    })

  }

}
