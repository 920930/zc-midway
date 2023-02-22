import { getRequest } from './wechat';
import config from '../config/config.default';
const { appId, appSecret } = config.wechat as any;

const getUserAccessToken = async (
  code: string
): Promise<{ access_token: string; openid: string }> => {
  return await getRequest(
    `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
  );
};

export const getUserInfo = async (
  code: string
): Promise<{
  wechatUser: {
    openid: string;
    nickname: string;
    sex: number;
    headimgurl: string;
  };
}> => {
  const { access_token, openid } = await getUserAccessToken(code);
  const wechatUser: any = await getRequest(
    `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
  );
  return {
    wechatUser,
  };
};
