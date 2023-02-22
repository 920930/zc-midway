import {
  Controller,
  Inject,
  Get,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { getUserInfo } from '../utils/wechatUser';
import { UserService } from '../service/user.service';
import { JwtMiddleware } from '../middleware/jwt.middleware'
// import { IndexError } from '../error/index.error';

@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/code')
  async create(@Query('code') code: string) {
    const { wechatUser } = await getUserInfo(code);
    if (Reflect.has(wechatUser, 'errcode')) {
      return wechatUser;
    }
    const { user, token } = await this.userService.create({
      name: wechatUser.nickname,
      avatar: wechatUser.headimgurl,
      openid: wechatUser.openid,
    });
    return {
      token,
      user,
    };
  }

  @Get('/qian', { middleware: [JwtMiddleware] })
  async qian(@Query('company') companyId: string){
    return this.userService.qian(this.ctx.openid, companyId)
  }

  @Get('/show')
  async show(@Query('openid') openid: string){
    return this.userService.show(openid);
  }
}
