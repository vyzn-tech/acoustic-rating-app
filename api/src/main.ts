import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('dbs-acoustic-rating')
    .setDescription('The dbs-acoustic-rating API description')
    .setVersion('1.0')
    .addTag('dbs-acoustic-rating')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/schema', app, document)

  await app.listen(3000)
}
bootstrap()
