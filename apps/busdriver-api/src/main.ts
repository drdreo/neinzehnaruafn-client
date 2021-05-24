/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  logger.setContext('main.ts');
  logger.log(`Running app in {${ process.env.NODE_ENV }} environment!`);

  const globalPrefix = 'busdriver';
  app.setGlobalPrefix(globalPrefix);

  const whitelist = ['http://localhost:4200'];
  logger.log(`Enabling CORS for ${ whitelist.join(' & ') }`);
  app.enableCors({
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Origin[${ origin }] Not allowed by CORS`));
      }
    },
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true
  });


  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
