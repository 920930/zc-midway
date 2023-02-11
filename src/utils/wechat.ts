import { makeHttpRequest } from '@midwayjs/core';
import { createHash } from 'crypto';
import { readFile, writeFile } from 'fs';
import config from '../config/config.default';
const {appId, appSecret} = config.wechat as any;

type TWechatToken = {
  access: { token: string; expires_in: number };
  ticket: { token: string; expires_in: number };
};

export const getRequest = async (url: string) => {
  const { data } = await makeHttpRequest(url, { dataType: 'json' });
  return data;
};

const getAccessTokenFromWechatServer = async (): Promise<{access_token: string;expires_in: number}> => {
  return await getRequest(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`);
};

const getJsApiTicketFromWechatServer = async (access_token: string): Promise<{ticket: string; expires_in: number}> => {
  return await getRequest(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`);
};

const getAccessToken = (ret: TWechatToken): Promise<{token: string; expires_in: number}> => {
  return new Promise(async (resolve, reject) => {
    if (ret.access.expires_in > Date.now()) return resolve(ret.access);
    try {
      const {access_token, expires_in} = await getAccessTokenFromWechatServer();
      resolve({token: access_token, expires_in: Date.now() + expires_in * 1000});
    } catch (error) {
      reject(error)
    }
  });
};

const getJsApiTicket = (): Promise<TWechatToken> => {
  return new Promise((resolve, reject) => {
    readFile(__dirname + '/wechatData.json', 'utf-8', async (err, data) => {
      if (err) return reject(err);
      const ret: TWechatToken = JSON.parse(data);
      try {
        if (ret.ticket.expires_in > Date.now()) return resolve(ret);
        const access = await getAccessToken(ret);
        const { ticket, expires_in } = await getJsApiTicketFromWechatServer(access.token);
        ret.access = access;
        ret.ticket.token = ticket;
        ret.ticket.expires_in = Date.now() + expires_in * 1000;
        writeFile(__dirname + '/wechatData.json',JSON.stringify(data),'utf-8',err => err);
        resolve(ret);
      } catch (error) {
        reject(error)
      }
    });
  });
};

export const getSignature = async (url: string) => {
  const data = await getJsApiTicket();
  const noncestr = Math.random().toString(36).slice(2);
  const timestamp = Date.now();
  const str = `jsapi_ticket=${data.ticket.token}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  const signature = createHash('sha1').update(str, 'utf-8').digest('hex');
  return {
    signature,
    noncestr,
    timestamp,
    appId,
  };
};