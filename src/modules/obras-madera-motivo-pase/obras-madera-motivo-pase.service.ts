import { Injectable, NotFoundException } from '@nestjs/common';
import { ObrasMaderaMotivoPase, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ObrasMaderaMotivoPaseService {

  constructor(private prisma: PrismaService) { }

  // ObrasMaderaMotivo por ID
  async getId(id: number): Promise<ObrasMaderaMotivoPase> {

    const motivo = await this.prisma.obrasMaderaMotivoPase.findFirst({
      where: { id },
      include: {
        creatorUser: true,
      }
    })

    if (!motivo) throw new NotFoundException('El motivo no existe');
    return motivo;

  }

  // Listar motivos
  async getAll({
    columna = 'descripcion',
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

    // Total de motivos
    const totalItems = await this.prisma.obrasMaderaMotivoPase.count({ where });

    // Listado de motivos
    const motivos = await this.prisma.obrasMaderaMotivoPase.findMany({
      take: Number(itemsPorPagina),
      include: {
        creatorUser: true,
      },
      // skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      motivos,
      totalItems,
    };

  }

  // Crear motivo
  async insert(createData: Prisma.ObrasMaderaMotivoPaseCreateInput): Promise<ObrasMaderaMotivoPase> {

    // Uppercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    // Verificacion: Descripcion repetida
    let motivoDB = await this.prisma.obrasMaderaMotivoPase.findFirst({ where: { descripcion: createData.descripcion } });
    if (motivoDB) throw new NotFoundException('El motivo ya se encuentra cargado');

    return await this.prisma.obrasMaderaMotivoPase.create({ data: createData, include: { creatorUser: true } });

  }

  // Actualizar motivo
  async update(id: number, updateData: Prisma.ObrasMaderaMotivoPaseUpdateInput): Promise<ObrasMaderaMotivoPase> {

    const { descripcion } = updateData;

    // Uppercase
    updateData.descripcion = updateData.descripcion?.toString().toLocaleUpperCase().trim();

    const motivoDB = await this.prisma.obrasMaderaMotivoPase.findFirst({ where: { id } });

    // Verificacion: El motivo no existe
    if (!motivoDB) throw new NotFoundException('El motivo no existe');

    // Verificacion: Motivo repetido
    if (descripcion) {
      const motivoRepetido = await this.prisma.obrasMaderaMotivoPase.findFirst({ where: { descripcion: descripcion.toString() } })
      if (motivoRepetido && motivoRepetido.id !== id) throw new NotFoundException('El motivo ya se encuentra cargado');
    }

    return await this.prisma.obrasMaderaMotivoPase.update({
      where: { id },
      data: updateData,
      include: {
        creatorUser: true
      }
    })

  }

}
