import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppCommand {
  @Command({
    command: 'test',
    describe: 'test',
  })
  async test() {
    console.log('test');
  }
}
