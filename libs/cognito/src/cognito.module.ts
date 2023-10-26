import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '@app/common/env/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
  ],
  providers: [
    CognitoService,
  ],
  exports: [CognitoService],
})
export class CognitoModule {}
