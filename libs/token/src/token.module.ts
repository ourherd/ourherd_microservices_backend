import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getEnvPath } from '@app/common/env/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

export class TokenModule {

  static register(): DynamicModule {
    return {
      module: TokenModule,
      imports: [
        JwtModule.registerAsync({
          imports: [
            ConfigModule.forRoot({
              envFilePath: envFilePath
            })
          ],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: '7d'
            }
          }),
          inject: [ConfigService]
        })
      ],
      exports: [JwtModule]
    }
  }
}
