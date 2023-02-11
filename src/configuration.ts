import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as sequelize from '@midwayjs/sequelize';
import * as crossDomain from '@midwayjs/cross-domain';
import * as dotenv from 'dotenv';
import * as jwt from '@midwayjs/jwt';
import * as cache from '@midwayjs/cache';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
// import { ReportMiddleware } from './middleware/report.middleware';

dotenv.config()

@Configuration({
  imports: [
    koa,
    validate,
    sequelize,
    crossDomain,
    jwt,
    cache,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // add middleware
    // this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
