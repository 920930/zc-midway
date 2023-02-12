import { getRequest } from './wechat';
import config from '../config/config.default';
import { makeHttpRequest } from '@midwayjs/core';
const { appId, appSecret } = config.wechat as any;

const getUserAccessToken = async (
  code: string
): Promise<{ access_token: string; openid: string }> => {
  return await getRequest(
    `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`
  );
};

const getUserQrcode = async (access_token: string) => {
  console.log(access_token);
  const { data } = await makeHttpRequest(
    `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${access_token}`,
    {
      method: 'POST',
      dataType: 'json',
      headers: {},
      data: {
        expire_seconds: 60 * 5,
        action_name: 'QR_SCENE',
        action_info: { scene: { scene_id: 123 } },
      },
    }
  );
  console.log(data);
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
  await getUserQrcode(access_token);
  const wechatUser: any = await getRequest(
    `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
  );
  return {
    wechatUser,
  };
};
