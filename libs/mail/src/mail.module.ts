import { DynamicModule, Inject } from "@nestjs/common";
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { SES } from "@aws-sdk/client-ses";


export class MailModule {

  static register(): DynamicModule {
    return {
      module: MailModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: './.env'
        }),
        MailerModule.forRoot({
          useFactory: (config: ConfigService) => {
            return {
              transport: {
                //ses configuration
                SES: new SES({
                  region: 'us-east-2',
                  accessKeyId: config.get<string>('AWS_SES_KEY'),
                  secretAccessKey: config.get<string>('AWS_SES_SECRET'),
                }),
              },
              defaults: {
                from: '"no-reply" <hello@ourherd.io>',
              },
              preview: true,
              templates: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                  strict: true,
                },
              },
            }
          },
        }),
      ],
      providers: []
    }
  }
}

