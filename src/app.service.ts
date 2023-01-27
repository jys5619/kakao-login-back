import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async kakaoLogin(param: { code: any; domain: any}): Promise<any> {
    const { code, domain } = param;
    const kakaoKey = '24e9228a6f37501f768b701db6f50265';    // 카카오 내 애플리케이션 : REST API 키
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';

    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      redirect_ri: `${domain}/kakao-callback`,
      code,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response = await axios({
        method: 'POST',
        url: kakaoTokenUrl,
        timeout: 30000,
        headers,
        data: qs.stringify(body)
      });


      if ( response.status === 200 ) {
        console.log(`token : ${JSON.stringify(response.data)}`);
        const headerUserInfo = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + response.data.access_token,
        };

        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo
        });

        if ( responseUserInfo.status === 200) {
          console.log(`userInfo: ${responseUserInfo.data}`);
          return responseUserInfo.data;
        } else {
          throw new UnauthorizedException();
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}
