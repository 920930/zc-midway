import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1675929894856_7837',
  koa: {
    port: 7001,
  },
  wechat: {
    // 测试平台
    appId: 'wx7e9980005e90',
    appSecret: '4e8bf5923e3300008a67012faff',
  },
  sequelize: {
    dataSource: {
      // 第一个数据源，数据源的名字可以完全自定义
      default: {
        database: 'zc315',
        username: 'root',
        password: '123456',
        host: '127.0.0.1',
        port: 3306,
        encrypt: false,
        dialect: 'mysql',
        define: { charset: 'utf8' },
        timezone: '+08:00',
        entities: [User],
        // 本地的时候，可以通过 sync: true 直接 createTable
        sync: true,
      },
    },
  },
  jwt: {
    secret: '7f24174e-80cb-4a88-8ccd-b22a0117fc63', // fs.readFileSync('xxxxx.key')
    expiresIn: '10s', // https://github.com/vercel/ms
  },
  cache: {
    store: 'memory',
    options: {
      max: 100,
      ttl: 7200,   // ttl过期时间，单位为秒
    },
  }
} as MidwayConfig & { wechat : { appId: string; appSecret: string }};
