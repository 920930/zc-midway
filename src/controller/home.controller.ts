import {
  Controller,
  Inject,
  Get,
  Post,
  Body,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { createHash } from 'crypto';
import { HomeService } from '../service/home.service';

@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;

  @Inject()
  homeService: HomeService;

  @Get('/')
  async home() {
    const { nonce, timestamp, echostr, signature } = this.ctx.query;
    const token = '7f24174e80cb4a888ccdb22a0117fc63';
    const str = [token, timestamp, nonce].sort().join('');
    const _signature = createHash('sha1').update(str, 'utf-8').digest('hex');
    if (_signature === signature) {
      return echostr as string;
    }
    return 'Hello Midwayjs!';
  }

  @Post('/init')
  async init(@Body() host: any) {
    let url = host.url;
    host.code && (url += `?code=${host.code}`);
    host.state && (url += `&state=${host.state}`);
    return await this.homeService.init(url);
  }
}
