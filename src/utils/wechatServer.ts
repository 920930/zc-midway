import { createHash } from 'crypto';
import { makeHttpRequest } from '@midwayjs/core';
import config from '../config/config.default';
const {appId, appSecret} = config.wechat;

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
  console.log('ticket', ticket)
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

// 发送模板消息
export const sendMessage = async (ACCESS_TOKEN: string, openid: string, companyId: string) => {
  const company = [
    {id: 1, name: '中储福森建材城华阳店'},
    {id: 2, name: '中储福森建材城大丰店'},
    {id: 3, name: '新福森林建材城'},
    {id: 4, name: '新红家居建材城'},
    {id: 5, name: '家福建材城'},
  ]
  await makeHttpRequest(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${ACCESS_TOKEN}`, {
    method: "POST",
    data: {
      touser: openid,
      // 中储福森
      template_id: 'dctJ6ZGJvF6US-HkU3Cc_N-GxvsbNgArGb0VXz1ZuSA',
      // 测试平台
      // template_id: 'YbKKrmyjsXxn4-TEsF0xG6qaay9zf5eLuqq8d7yppfE',
      url: `http://tp.920930.com/show/${Number.parseInt(companyId) + 1}`,
      data: {
        first: {
          value: '尊敬的用户您好：感谢您参与中储福森建材城诚信315 品质有保障活动。散打评书艺术家李伯清助阵 从不假打！',
        },
        keyword1: {
          value: '0.00',
          color: "#1d1d1d",
        },
        keyword2: {
          value: company[companyId].name,
          color: "#1d1d1d",
        },
        remark: {
            "value": "已签到成功，感谢您对中储福森集团的支持！中储福森大牌不贵，实惠！",
            "color": "#173177"
        }
      }
    },
    dataType: 'json'
  });
}