import { RabbitModule, RabbitServiceName } from '@app/rabbit';
import { TokenModule } from '@app/token';
import { DynamicModule } from '@nestjs/common';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '@app/common/env/env.helper';

export class AuthenticationModule {
  static register(): DynamicModule {
    return {
      module: AuthenticationModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: './.env'
        }),
        TokenModule.register(),
        RabbitModule.forClientProxy(RabbitServiceName.MEMBER),
        RabbitModule.forClientProxy(RabbitServiceName.ACCOUNT)
      ],
      providers: [JwtStrategy],
      exports: [JwtStrategy]
    }
  }
}
