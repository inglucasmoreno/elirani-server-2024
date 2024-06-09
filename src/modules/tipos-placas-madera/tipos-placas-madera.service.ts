import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TiposPlacasMadera } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TiposPlacasMaderaService {

  constructor(private prisma: PrismaService) { }

  // TipoPlacasMadera por ID
  async getId(id: number): Promise<TiposPlacasMadera> {

    const tipo = await this.prisma.tiposPlacasMadera.findFirst({
      where: { id },
      include: {
        creatorUser: true,
      }
    })

    if (!tipo) throw new NotFoundException('El tipo no existe');
    return tipo;

  }

  // Listar tipos
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

    // Total de tipos
    const totalItems = await this.prisma.tiposPlacasMadera.count({ where });

    // Listado de tipos
    const tipos = await this.prisma.tiposPlacasMadera.findMany({
      take: Number(itemsPorPagina),
      include: {
        creatorUser: true,
      },
      // skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      tipos,
      totalItems,
    };

  }

  // Crear tipo
  async insert(createData: Prisma.TiposPlacasMaderaCreateInput): Promise<TiposPlacasMadera> {

    // Uppercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    // Verificacion: Descripcion repetida
    let tipoDB = await this.prisma.tiposPlacasMadera.findFirst({ where: { descripcion: createData.descripcion } });
    if (tipoDB) throw new NotFoundException('El tipo ya se encuentra cargado');

    return await this.prisma.tiposPlacasMadera.create({ data: createData, include: { creatorUser: true } });

  }

  // Actualizar tipo
  async update(id: number, updateData: Prisma.TiposPlacasMaderaUpdateInput): Promise<TiposPlacasMadera> {

    const { descripcion } = updateData;

    // Uppercase
    updateData.descripcion = updateData.descripcion?.toString().toLocaleUpperCase().trim();

    const tipoDB = await this.prisma.tiposPlacasMadera.findFirst({ where: { id } });

    // Verificacion: El tipo no existe
    if (!tipoDB) throw new NotFoundException('El tipo no existe');

    // Verificacion: Tipo repetido
    if (descripcion) {
      const tipoRepetido = await this.prisma.tiposPlacasMadera.findFirst({ where: { descripcion: descripcion.toString() } })
      if (tipoRepetido && tipoRepetido.id !== id) throw new NotFoundException('El tipo ya se encuentra cargado');
    }

    return await this.prisma.tiposPlacasMadera.update({
      where: { id },
      data: updateData,
      include: {
        creatorUser: true
      }
    })

  }

}
