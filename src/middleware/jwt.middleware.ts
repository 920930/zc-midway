import { Inject, Middleware, IMiddleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { IndexError } from '../error/index.error'

@Middleware()
export class JwtMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwtService: JwtService;

  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']) {
        throw new IndexError('请登录', 401);
      }
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ');

      if (parts.length !== 2) {
        throw new IndexError('token错误');
      }
      const [scheme, token] = parts;

      if (/^Bearer$/i.test(scheme)) {
        try {
          //jwt.verify方法验证token是否有效
          const jwter = await this.jwtService.verify(token, {
            complete: true,
          });
          ctx.openid = (jwter as any).payload.openid;
        } catch (error) {
          // 这里存在一个bug，所有过期的token，都可以解析出来
          const jwter = this.jwtService.decodeSync(token) as any;
          if(!jwter) throw new IndexError('token错误', 401);
          //token过期 生成新的token
          const newToken = this.jwtService.signSync({openid: jwter.openid});
          ctx.openid = jwter.openid;
          //将新token放入Authorization中返回给前端
          // ctx.res.setHeader("Access-Control-Expose-Headers", "Authorization");
          // ctx.res.setHeader("Authorization", newToken);
          ctx.set('Access-Control-Expose-Headers', "Authorization")
          ctx.set('Authorization', `Bearer ${newToken}`)
        }
        await next();
      }
    };
  }

  // ignore(ctx: Context): boolean {
  //   // 下面的路由将忽略此中间件
  //   return ctx.path === '/'
  //     || ctx.path === '/api/auth'
  //     || ctx.path === '/api/login';
  // }

  // 配置鉴权的路由地址
  public match(ctx: Context): boolean {
    const arr = ['/show', '/qian']
    return arr.includes(ctx.path);
  }
}