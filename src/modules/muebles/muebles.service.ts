import { Injectable, NotFoundException } from '@nestjs/common';
import { Muebles, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MueblesService {

  constructor(private prisma: PrismaService) { }

  // Mueble por ID
  async getId(id: number): Promise<Muebles> {

    const mueble = await this.prisma.muebles.findFirst({
      where: { id },
      include: {
        obraMadera: true,
        tipoMueble: true,
        creatorUser: true,
      }
    })

    if (!mueble) throw new NotFoundException('El mueble no existe');
    return mueble;

  }

  // Listar muebles
  async getAll({
    columna = 'id',
    direccion = 'desc',
    activo = '',
    parametro = '',
    pagina = 1,
    itemsPorPagina = 10000
  }: any): Promise<any> {

    // Ordenando datos
    let orderBy = {};
    orderBy[columna] = direccion;

    let where = {};

    if (activo !== '') {
      where = {
        ...where,
        activo: activo === 'true' ? true : false
      };
    }

    // where.OR.push({
    //   descripcion: {
    //     contains: parametro.toUpperCase()
    //   }
    // })

    // Total de muebles
    const totalItems = await this.prisma.muebles.count({ where });

    // Listado de muebles
    const muebles = await this.prisma.muebles.findMany({
      take: Number(itemsPorPagina),
      include: {
        obraMadera: true,
        tipoMueble: true,
        creatorUser: true,
      },
      // skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      muebles,
      totalItems,
    };

  }

  // Crear mueble
  async insert(createData: Prisma.MueblesCreateInput): Promise<Muebles> {

    // Uppercase
    createData.observaciones = createData.observaciones?.toString().toLocaleUpperCase().trim();

    return await this.prisma.muebles.create({ data: createData, include: { 
      obraMadera: true,
      tipoMueble: true,
      creatorUser: true 
    } });

  }

  // Actualizar mueble
  async update(id: number, updateData: Prisma.MueblesUpdateInput): Promise<Muebles> {

    // Uppercase
    updateData.observaciones = updateData.observaciones?.toString().toLocaleUpperCase().trim();

    // Verificacion: La mueble no existe
    const muebleDB = await this.prisma.muebles.findFirst({ where: { id } });
    if (!muebleDB) throw new NotFoundException('El mueble no existe');

    return await this.prisma.muebles.update({
      where: { id },
      data: updateData,
      include: {
        obraMadera: true,
        tipoMueble: true,
        creatorUser: true
      }
    })

  }

}
