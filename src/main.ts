import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import *  as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {logger: console},);
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
