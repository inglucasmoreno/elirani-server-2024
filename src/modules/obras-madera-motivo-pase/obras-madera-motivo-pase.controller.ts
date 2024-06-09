import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ObrasMaderaMotivoPaseService } from './obras-madera-motivo-pase.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('obras-madera-motivo-pase')
export class ObrasMaderaMotivoPaseController {

  constructor(private readonly obrasMaderaMotivoPaseService: ObrasMaderaMotivoPaseService){}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getId(@Res() res, @Param('id') id: number): Promise<any> {

    const motivo = await this.obrasMaderaMotivoPaseService.getId(id);
    
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Motivo obtenido correctamente',
      motivo
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    
    const {motivos, totalItems} = await this.obrasMaderaMotivoPaseService.getAll(query);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Motivos obtenidos correctamente',
      motivos,
      totalItems   
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Res() res, @Body() createData: Prisma.ObrasMaderaMotivoPaseCreateInput): Promise<any> {

    const motivo = await this.obrasMaderaMotivoPaseService.insert(createData);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Motivo creado correctamente',
      motivo
    })
  
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() dataUpdate: Prisma.TiposMueblesUpdateInput){

    const motivo = await this.obrasMaderaMotivoPaseService.update(id, dataUpdate);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Motivo actualizado correctamente',
      motivo
    })

  }

}
