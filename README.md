## Informacion inicial
- `Node v20.0.9`
- `NPM v9.5.1`

## Comenzando
```bash
# Instalacion de librerias
$ yarn install
```

## Variables de entorno
- Configurar las `variables de entorno` primero que todo

## Docker
- Se inicia contenedor de docker - `Mysql y phpMyAdmin`
```bash
$ docker compose up -d
```

## Prisma ORM
- Migracion de inicializacion
```bash
$ yarn prisma:init
```

## Ejecucion de proyecto
```bash
# Desarrollo
$ yarn start

# Modo seguimiento
$ yarn start:dev

# Modo produccion
$ yarn start:prod
```

## Desarrollado por

- Author - Ing. Moreno Lucas Omar
- Linkedin - [Comunicate conmigo!](https://www.linkedin.com/in/lucas-omar-moreno-16246678)