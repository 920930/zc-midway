import { createHash } from 'crypto';
import { makeHttpRequest } from '@midwayjs/core';
import config from '../config/config.default';
const {appId, appSecret} = config.wechat as any;

export const getRequest = async (url: string) => {
  const { data } = await makeHttpRequest(url, { dataType: 'json' });
  return data;
};

export const getAccessToken = async (): Promise<{access_token: string;expires_in: number}> => {
  return await getRequest(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`);
};

export const getJsApiTicket = async (access_token: string): Promise<{ticket: string; expires_in: number}> => {
  return await getRequest(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`);
};

// export const getAccessToken = async () => getAccessTokenFromWechatServer();

// export const getJsApiTicket = async (access: string) => getJsApiTicketFromWechatServer(access);

export const getSignature = async (url: string, ticket: string) => {
  const noncestr = Math.random().toString(36).slice(2);
  const timestamp = Date.now();
  const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  const signature = createHash('sha1').update(str, 'utf-8').digest('hex');
  return {
    signature,
    noncestr,
    timestamp,
    appId,
  };
};