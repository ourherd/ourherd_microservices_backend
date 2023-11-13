import { Module } from '@nestjs/common';
import { MailSengridProvider } from './mail.sengrid.provider';
import { MailSengridService } from './mail.sengrid.service';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '@app/common/env/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath
    }),
  ],
  providers: [...MailSengridProvider, MailSengridService],
  exports: [...MailSengridProvider, MailSengridService]
})
export class MailSengridModule { }
