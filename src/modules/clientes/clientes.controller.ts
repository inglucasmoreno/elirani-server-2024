import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('clientes')
export class ClientesController {

  constructor(private readonly clientesService: ClientesService) { }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getId(@Res() res, @Param('id') id: number): Promise<any> {

    const cliente = await this.clientesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Cliente obtenido correctamente',
      cliente
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/identificacion/:identificacion')
  async getIdentificacion(@Res() res, @Param('identificacion') identificacion: string): Promise<any> {

    const cliente = await this.clientesService.getIdentificacion(identificacion);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Cliente obtenido correctamente',
      cliente
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Res() res, @Query() query): Promise<any> {

    const { clientes, totalItems } = await this.clientesService.getAll(query);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Clientes obtenidos correctamente',
      clientes,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async insert(@Res() res, @Body() createData: Prisma.ClientesCreateInput): Promise<any> {

    const cliente = await this.clientesService.insert(createData);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Cliente creado correctamente',
      cliente
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Res() res, @Param('id') id: number, @Body() dataUpdate: Prisma.ClientesUpdateInput) {

    const cliente = await this.clientesService.update(id, dataUpdate);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Cliente actualizado correctamente',
      cliente
    })

  }

}
