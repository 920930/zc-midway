import { Provide, Inject } from '@midwayjs/decorator';
import { User } from '../entity/user';
import { JwtService } from '@midwayjs/jwt';
import { CacheManager } from '@midwayjs/cache';
import { sendMessage } from '../utils/wechatServer';

@Provide()
export class UserService {
  @Inject()
  cacheManager: CacheManager;

  @Inject()
  jwtService: JwtService;

  async create({ name, avatar, openid }) {
    const oldUser = await User.findOne({
      where: { openid },
    });
    if (oldUser) {
      const token = this.jwtService.signSync({ openid });
      return {
        token: `Bearer ${token}`,
        user: oldUser,
      };
    }
    let user = new User({ name, avatar, openid });
    await user.save();
    const token = this.jwtService.signSync({ id: user.id, openid });
    return {
      token: `Bearer ${token}`,
      user,
    };
  }

  async qian(openid: string, companyId: string){
    const user = await User.findOne({
      where: { openid }
    });
    if(!user.sign) {
      user.sign = true;
      await user.save()
    }
    const accessCache: string = await this.cacheManager.get('access');
    accessCache && sendMessage(accessCache, openid, companyId)
    return {openid, sign: true, message: '签到成功'}
  }

  async show(openid: string){
    return User.findOne({
      where: { openid }
    });
  }
}
