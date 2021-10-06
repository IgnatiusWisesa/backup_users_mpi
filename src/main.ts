import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set pipes
  app.useGlobalPipes(new ValidationPipe())

  // set container for validate
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // set swagger
  const config = new DocumentBuilder()
    .setTitle('MPI User Management APIs')
    .setDescription('Descriptions for MPI User Management Service APIs')
    .setVersion('1.0')
    .build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('/api', app, document)

  await app.listen( process.env.PORT || 3020 );
}
bootstrap();
