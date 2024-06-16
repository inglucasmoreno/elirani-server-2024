import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdenesMantenimientoMadera, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdenesMantenimientoMaderaService {

  constructor(private prisma: PrismaService) { }

  // Ordenes por ID
  async getId(id: number): Promise<OrdenesMantenimientoMadera> {

    const orden = await this.prisma.ordenesMantenimientoMadera.findFirst({
      where: { id },
      include: {
        obraMadera: true,
        creatorUser: true,
      }
    })

    if (!orden) throw new NotFoundException('La orden no existe');
    return orden;

  }

  // Listar ordenes
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

    // Total de ordenes
    const totalItems = await this.prisma.ordenesMantenimientoMadera.count({ where });

    // Listado de ordenes
    const ordenes = await this.prisma.ordenesMantenimientoMadera.findMany({
      take: Number(itemsPorPagina),
      include: {
        obraMadera: true,
        creatorUser: true,
      },
      // skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      ordenes,
      totalItems,
    };

  }

  // Crear ordenes
  async insert(createData: Prisma.OrdenesMantenimientoMaderaCreateInput): Promise<OrdenesMantenimientoMadera> {

    // Uppercase
    createData.observaciones = createData.observaciones?.toString().toLocaleUpperCase().trim();

    return await this.prisma.ordenesMantenimientoMadera.create({ data: createData, include: { 
      obraMadera: true,
      creatorUser: true 
    } });

  }

  // Actualizar orden
  async update(id: number, updateData: Prisma.OrdenesMantenimientoMaderaUpdateInput): Promise<OrdenesMantenimientoMadera> {

    // Uppercase
    updateData.observaciones = updateData.observaciones?.toString().toLocaleUpperCase().trim();

    // Verificacion: La orden existe
    const ordenDB = await this.prisma.ordenesMantenimientoMadera.findFirst({ where: { id } });
    if (!ordenDB) throw new NotFoundException('La orden no existe');

    return await this.prisma.ordenesMantenimientoMadera.update({
      where: { id },
      data: updateData,
      include: {
        obraMadera: true,
        creatorUser: true
      }
    })

  }

}
