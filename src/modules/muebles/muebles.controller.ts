import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { MueblesService } from './muebles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('muebles')
export class MueblesController {

  constructor(private readonly mueblesService: MueblesService){}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getId(@Res() res, @Param('id') id: number): Promise<any> {

    const mueble = await this.mueblesService.getId(id);
    
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Mueble obtenido correctamente',
      mueble
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    
    const {muebles, totalItems} = await this.mueblesService.getAll(query);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Muebles obtenidos correctamente',
      muebles,
      totalItems   
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Res() res, @Body() createData: Prisma.MueblesCreateInput): Promise<any> {

    const mueble = await this.mueblesService.insert(createData);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Mueble creado correctamente',
      mueble
    })
  
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() dataUpdate: Prisma.MueblesUpdateInput){

    const mueble = await this.mueblesService.update(id, dataUpdate);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Mueble actualizado correctamente',
      mueble
    })

  }

}
