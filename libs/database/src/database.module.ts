import { DynamicModule } from '@nestjs/common';
import { Database } from './interface/database.interface';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_CONFIG } from './constant/database.constant';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { getEnvPath } from '@app/common/env/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/`);

export class DatabaseModule {

  static register(database: Database): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          name: database,
          imports: [
            ConfigModule.forRoot({
              envFilePath: envFilePath
            }),
          ],
          useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
            const config = DATABASE_CONFIG[database];
            // @ts-ignore
            return {
              type: config.type,
              host: configService.get(`${config.env}_DB_HOST`),
              port: configService.get(`${config.env}_DB_PORT`),
              database: configService.get(`${config.env}_DB_NAME`),
              username: configService.get(`${config.env}_DB_USERNAME`),
              password: configService.get<string>(`${config.env}_DB_PASSWORD`),
              entities: config.entities,
              synchronize: false
            };
          },
          inject: [ConfigService]
        }),
      ],
      exports: [TypeOrmModule]
    }
  }

  static forEntity(database: Database, entities: EntityClassOrSchema[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forFeature(entities, database)
      ],
      exports: [TypeOrmModule]
    };
  }
}
