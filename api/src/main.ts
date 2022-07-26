import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('acoustic-rating-app')
    .setDescription('The acoustic-rating-app API description')
    .setVersion('1.0')
    .addTag('acoustic-rating-app')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/schema', app, document)

  await app.listen(8111)
}
bootstrap()
