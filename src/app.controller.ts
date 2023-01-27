import { BadRequestException, Body, Controller, Get, Post, Response, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/login')
  async login(@Body() body: any, @Response() res): Promise<any> {
    try {
      const { code, domain } = body;
      if ( !code || !domain ) {
        throw new BadRequestException( '카카오 로그인 정보가 없습니다.')
      }
      const kakao = await this.appService.kakaoLogin({code, domain});
      console.log(`kakaoUser : ${JSON.stringify(kakao)}`);
      res.send({
        user: kakao,
        message: 'success'
      });
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException()
    }
  }
}
