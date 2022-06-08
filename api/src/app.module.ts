import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommandModule } from 'nestjs-command'
import { AppCommand } from './app.command'

@Module({
  imports: [CommandModule],
  controllers: [AppController],
  providers: [AppService, AppCommand],
})
export class AppModule {}
