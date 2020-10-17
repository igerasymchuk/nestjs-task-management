import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import *  as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap', true);
  const app = await NestFactory.create(AppModule, {logger: console},);

  //swagger
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Task management API')
    .setDescription('Task management API description')
    .setVersion('1.0')
    //.addTag('task')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);


  const serverConfig = config.get('server');  

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin});
    logger.log(`Accepting requests from origin ${ serverConfig.origin }`);
  }
  //app.enableCors();
  logger.log(`Application is running in ${process.env.NODE_ENV } mode`);
  
  const port = process.env.PORT || serverConfig.port;

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
