import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ObrasMaderaService } from './obras-madera.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('obras-madera')
export class ObrasMaderaController {

  constructor(private readonly obrasMaderaService: ObrasMaderaService){}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getId(@Res() res, @Param('id') id: number): Promise<any> {

    const obra = await this.obrasMaderaService.getId(id);
    
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obra obtenida correctamente',
      obra
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {
    
    const {obras, totalItems} = await this.obrasMaderaService.getAll(query);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obras obtenidas correctamente',
      obras,
      totalItems   
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Res() res, @Body() createData: Prisma.ObrasMaderaCreateInput): Promise<any> {

    console.log(createData)

    const obra = await this.obrasMaderaService.insert(createData);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Obra creada correctamente',
      obra
    })
  
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() dataUpdate: Prisma.ObrasMaderaUpdateInput){

    const obra = await this.obrasMaderaService.update(id, dataUpdate);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Obra actualizada correctamente',
      obra
    })

  }

}
