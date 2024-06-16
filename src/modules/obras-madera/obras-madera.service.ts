import { Injectable, NotFoundException } from '@nestjs/common';
import { ObrasMadera, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ObrasMaderaService {

  constructor(private prisma: PrismaService) { }

  // Obra por ID
  async getId(id: number): Promise<ObrasMadera> {

    const obra = await this.prisma.obrasMadera.findFirst({
      where: { id },
      include: {
        cliente: true,
        creatorUser: true,
      }
    })

    if (!obra) throw new NotFoundException('La obra no existe');
    return obra;

  }

  // Listar obras
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

    // Total de obras
    const totalItems = await this.prisma.obrasMadera.count({ where });

    // Listado de obras
    const obras = await this.prisma.obrasMadera.findMany({
      take: Number(itemsPorPagina),
      include: {
        cliente: true,
        creatorUser: true,
      },
      // skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      obras,
      totalItems,
    };

  }

  // Crear obra
  async insert(createData: Prisma.ObrasMaderaCreateInput): Promise<ObrasMadera> {

    // Uppercase
    createData.codigo = createData.codigo?.toString().toLocaleUpperCase().trim();
    createData.descripcion = createData.descripcion?.toString().toLocaleUpperCase().trim();
    createData.domicilio = createData.domicilio?.toString().toLocaleUpperCase().trim();
    
    // Adaptacion de fechas
    // createData.fechaInicio = new Date(createData.fechaInicio);

    // Verificacion: Codigo repetido
    let obraDB = await this.prisma.obrasMadera.findFirst({ where: { codigo: createData.codigo } });
    if (obraDB) throw new NotFoundException('El código ya se encuentra cargado');

    return await this.prisma.obrasMadera.create({ data: createData, include: { 
      cliente: true,
      creatorUser: true 
    } });

  }

  // Actualizar obra
  async update(id: number, updateData: Prisma.ObrasMaderaUpdateInput): Promise<ObrasMadera> {

    const { codigo } = updateData;

    // Uppercase
    updateData.codigo = updateData.codigo?.toString().toLocaleUpperCase().trim();
    updateData.descripcion = updateData.descripcion?.toString().toLocaleUpperCase().trim();
    updateData.domicilio = updateData.domicilio?.toString().toLocaleUpperCase().trim();

    // Verificacion: La obra no existe
    const obraDB = await this.prisma.obrasMadera.findFirst({ where: { id } });
    if (!obraDB) throw new NotFoundException('La obra no existe');

    // Verificacion: Codigo repetido
    if (codigo) {
      const codigoRepetido = await this.prisma.obrasMadera.findFirst({ where: { codigo: codigo.toString() } })
      if (codigoRepetido && codigoRepetido.id !== id) throw new NotFoundException('El código ya se encuentra cargado');
    }

    return await this.prisma.obrasMadera.update({
      where: { id },
      data: updateData,
      include: {
        cliente: true,
        creatorUser: true
      }
    })

  }

}
