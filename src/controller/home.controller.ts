import { Controller, Inject, Get, Post, Body, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { createHash } from 'crypto';
import { getUserInfo } from '../utils/wechatUser';
import { UserService } from '../service/user.service';
import { IndexError } from '../error/index.error';

@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/')
  async home(): Promise<string> {
    const { nonce, timestamp, echostr, signature } = this.ctx.query;
    const token = '2270b0fb-39db-4a14-9f83-34aaf9f8c90b';
    const str = [token, timestamp, nonce].sort().join('');
    const _signature = createHash('sha1').update(str, 'utf-8').digest('hex');
    console.log(this.ctx.query)
    console.log(_signature)
    if(_signature === signature) {
      return echostr as string;
    }
    return 'Hello Midwayjs!';
  }

  @Post('/init')
  async init(@Body() host: any) {
    let url = host.url;
    host.code && (url += `?code=${host.code}`)
    host.state && (url += `&state=${host.state}`)
    return await this.userService.init(url);
  }

  @Get('/login')
  async login (@Query('code') code: string) {
    if(!code) return '213'
    const user = await getUserInfo(code)
    return {
      user
    }
  }

  @Get('/code')
  async code (@Query('code') code: string) {
    const wechatUser = await getUserInfo(code)
    if(Reflect.has(wechatUser, 'errcode')) {
      throw new IndexError(wechatUser['errmsg'])
    }
    const { user, token} = await this.userService.create({name: wechatUser.nickname, avatar: wechatUser.headimgurl, openid: wechatUser.openid})
    return {
      token,
      user: {id: user.id, name: user.name, avatar: user.avatar, openid: user.openId}
    }
  }
}
