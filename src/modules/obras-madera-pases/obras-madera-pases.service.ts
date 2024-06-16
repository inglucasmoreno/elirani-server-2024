import { Injectable, NotFoundException } from '@nestjs/common';
import { ObrasMaderaPases, ObrasMadera, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ObrasMaderaPasesService {

  constructor(private prisma: PrismaService) { }

  // Relacion por ID
  async getId(id: number): Promise<ObrasMaderaPases> {

    const relacion = await this.prisma.obrasMaderaPases.findFirst({
      where: { id },
      include: {
        obraMadera: true,
        obraMaderaMotivoPase: true,
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
    const totalItems = await this.prisma.obrasMaderaPases.count({ where });

    // Listado de relaciones
    const relaciones = await this.prisma.obrasMaderaPases.findMany({
      take: Number(itemsPorPagina),
      include: {
        obraMadera: true,
        obraMaderaMotivoPase: true,
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
  async insert(createData: Prisma.ObrasMaderaPasesCreateInput): Promise<ObrasMaderaPases> {

    // Uppercase
    createData.direccion = createData.direccion?.toString().toLocaleUpperCase().trim();
    createData.observaciones = createData.observaciones?.toString().toLocaleUpperCase().trim();

    return await this.prisma.obrasMaderaPases.create({ data: createData, include: { 
      obraMadera: true,
      obraMaderaMotivoPase: true,
      creatorUser: true,
    } });

  }

  // Actualizar relacion
  async update(id: number, updateData: Prisma.ObrasMaderaPasesUpdateInput): Promise<ObrasMaderaPases> {

    // Uppercase
    updateData.direccion = updateData.direccion?.toString().toLocaleUpperCase().trim();
    updateData.observaciones = updateData.observaciones?.toString().toLocaleUpperCase().trim();

    // Verificacion: La relacion no existe
    const relacionDB = await this.prisma.obrasMaderaPases.findFirst({ where: { id } });
    if (!relacionDB) throw new NotFoundException('La relacion no existe');

    return await this.prisma.obrasMaderaPases.update({
      where: { id },
      data: updateData,
      include: {
        obraMadera: true,
        obraMaderaMotivoPase: true,
        creatorUser: true,
      }
    })

  }
}
