import { Injectable, NotFoundException } from '@nestjs/common';
import { Clientes, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClientesService {

  constructor(private prisma: PrismaService) { }

  // Cliente por ID
  async getId(id: number): Promise<Clientes> {

    const cliente = await this.prisma.clientes.findFirst({
      where: { id },
      include: {
        creatorUser: true,
      }
    })

    if (!cliente) throw new NotFoundException('El cliente no existe');
    return cliente;

  }

  // Cliente por identificacion
  async getIdentificacion(identificacion: string): Promise<Clientes> {

    const cliente = await this.prisma.clientes.findFirst({
      where: { identificacion },
      include: {
        creatorUser: true,
      }
    })

    return cliente;

  }

  // Listar clientes
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

    let where: any = {};

    if (activo.trim() !== '') {
      where = { ...where, activo: activo === 'true' ? true : false }
    }

    if (parametro.trim() !== '') {
      where = {
        ...where,
        OR: [
          { descripcion: { contains: parametro.toUpperCase() } },
          { identificacion: { contains: parametro.toUpperCase() } }
        ]
      }
    }

    // Total de clientes
    const totalItems = await this.prisma.clientes.count({ where });

    // Listado de clientes
    const clientes = await this.prisma.clientes.findMany({
      take: Number(itemsPorPagina),
      include: {
        creatorUser: true,
      },
      // skip: (pagina - 1) * itemsPorPagina,
      orderBy,
      where
    })

    return {
      clientes,
      totalItems,
    };

  }

  // Crear cliente
  async insert(createData: Prisma.ClientesCreateInput): Promise<Clientes> {

    // Uppercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();
    createData.domicilio = createData.domicilio?.toLocaleUpperCase().trim();
    createData.email = createData.email?.toLocaleLowerCase().trim();

    // Verificamos si la identificacion ya se encuentra cargada
    const clienteDB = await this.prisma.clientes.findFirst({
      where: {
        OR: [
          { identificacion: createData.identificacion }
        ]
      }
    });

    if (clienteDB) throw new NotFoundException('El cliente ya se encuentra cargado');

    return await this.prisma.clientes.create({ data: createData, include: { creatorUser: true } });

  }

  // Actualizar cliente
  async update(id: number, updateData: Prisma.ClientesUpdateInput): Promise<Clientes> {

    const { identificacion } = updateData;

    // Uppercase
    updateData.descripcion = updateData.descripcion?.toString().toLocaleUpperCase().trim();
    updateData.email = updateData.email?.toString().toLocaleLowerCase().trim();


    const clienteDB = await this.prisma.clientes.findFirst({ where: { id } });

    // Verificacion: El cliente no existe
    if (!clienteDB) throw new NotFoundException('El cliente no existe');

    // Verificacion: identificacion repetida
    if (identificacion) {
      const clienteRepetido = await this.prisma.clientes.findFirst({ where: { identificacion: identificacion.toString() } })
      if (clienteRepetido && clienteRepetido.id !== id) throw new NotFoundException('La identificación ya se encuentra cargada');
    }

    return await this.prisma.clientes.update({
      where: { id },
      data: updateData,
      include: {
        creatorUser: true
      }
    })

  }

}
