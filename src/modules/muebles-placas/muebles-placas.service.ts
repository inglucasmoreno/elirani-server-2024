import { Injectable, NotFoundException } from '@nestjs/common';
import { MueblesPlacas, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MueblesPlacasService {

  constructor(private prisma: PrismaService) { }

  // Relacion por ID
  async getId(id: number): Promise<MueblesPlacas> {

    const relacion = await this.prisma.mueblesPlacas.findFirst({
      where: { id },
      include: {
        mueble: true,
        tipoPlacaMadera: true,
        creatorUser: true,
      }
    })

    if (!relacion) throw new NotFoundException('La relacion no existe');
    return relacion;

  }

  // Listar relaciones
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

    // Total de relaciones
    const totalItems = await this.prisma.mueblesPlacas.count({ where });

    // Listado de relaciones
    const relaciones = await this.prisma.mueblesPlacas.findMany({
      take: Number(itemsPorPagina),
      include: {
        mueble: true,
        tipoPlacaMadera: true,
        creatorUser: true,
      },
      // skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      relaciones,
      totalItems,
    };

  }

  // Crear relacion
  async insert(createData: Prisma.MueblesPlacasCreateInput): Promise<MueblesPlacas> {

    return await this.prisma.mueblesPlacas.create({ data: createData, include: { 
      mueble: true,
      tipoPlacaMadera: true,
      creatorUser: true 
    } });

  }

  // Actualizar relacion
  async update(id: number, updateData: Prisma.MueblesPlacasUpdateInput): Promise<MueblesPlacas> {

    // Verificacion: La relacion no existe
    const relacionDB = await this.prisma.mueblesPlacas.findFirst({ where: { id } });
    if (!relacionDB) throw new NotFoundException('La relacion no existe');

    return await this.prisma.mueblesPlacas.update({
      where: { id },
      data: updateData,
      include: {
        mueble: true,
        tipoPlacaMadera: true,
        creatorUser: true
      }
    })

  }

}
