import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import { NestFactory, Reflector } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@app/common';
import { GATEWAY_SERVICE } from "./constant/gateway-patterns.constants";
import { useContainer } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule);
  useContainer(app.select(GatewayModule), { fallbackOnErrors: true });

  // * config
  const configService = app.get(ConfigService);

  // * settings
  app.enableCors();
  app.setGlobalPrefix('/api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  // * middlewares
  app.use(compression());
  app.use(helmet({ crossOriginResourcePolicy: false }));

  // * assets
  app.useStaticAssets(path.join(__dirname, '..', 'public'), { index: false, prefix: '/public' });

  // * swagger
  const documentConfig = new DocumentBuilder()
    .setTitle('Ourherd Gateway API')
    .setDescription('Ourherd API Documention')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, documentConfig);
  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup('/document', app, document, { jsonDocumentUrl: '/document.json' });

  let logger = new Logger('Gateway API');
  await app.listen(configService.get<number>('GATEWAY_PORT'));

  logger.log(
    `🚀 Application { ` + GATEWAY_SERVICE + ` } running on port ` + configService.get<number>('GATEWAY_PORT'),
  );

}
bootstrap();
