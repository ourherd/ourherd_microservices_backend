## Description

Ourherd Microservices

Checkout the project from github

## stack

* NestJS [Nest](https://github.com/nestjs/nest)
* RabbitMQ [RabbitMQ](https://github.com/nestjs/nest)
* Postgres [Postgres](https://github.com/nestjs/nest)
* Redis [Redis](https://github.com/nestjs/nest)
* PGAdmin [PGAdmin](https://github.com/nestjs/nest)

## Installation 

```bash
$ yarn  install
```

## Run the application

Make sure you have a .env available (the env file is available in 1PASSWORD)

```bash
$ docker-compose -f docker-compose.core.yaml up
```

### Database 
Create DB on docker by using any PG client such as PGAdmin running on port 5000,
Create tables depending on what you are working on sql scrips are in docs/db

``
create database ourherd_app_db
``

Initialize the Gateway and the modules you are going to work with

Always init the Gateway 
```bash
$ yarn start:dev 
```

Depending on the module to be working on init it

```bash
$ yarn start:dev module
```


