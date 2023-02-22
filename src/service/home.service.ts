import { Provide, Inject } from '@midwayjs/decorator';
import { CacheManager } from '@midwayjs/cache';
import {
  getSignature,
  getJsApiTicket,
  getAccessToken,
} from '../utils/wechatServer';

@Provide()
export class HomeService {
  @Inject()
  cacheManager: CacheManager;

  async init(url: string) {
    // 如果ticket存在，没过期
    const ticketCache: string = await this.cacheManager.get('ticket');
    if (ticketCache) {
      return await getSignature(url, ticketCache);
    }
    // 如果access存在，没过期
    const accessCache: string = await this.cacheManager.get('access');
    if (accessCache) {
      const { ticket } = await getJsApiTicket(accessCache);
      this.cacheManager.set('ticket', ticket);
      return await getSignature(url, ticket);
    }
    // 都不存在
    const { access_token } = await getAccessToken();
    const { ticket } = await getJsApiTicket(access_token);
    this.cacheManager.set('access', access_token);
    this.cacheManager.set('ticket', ticket);
    return await getSignature(url, ticket);
  }
}
