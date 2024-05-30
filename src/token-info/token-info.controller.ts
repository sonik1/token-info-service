// src/token-info/token-info.controller.ts

import { Controller, Get, Query, Headers } from '@nestjs/common';
import { TokenInfoService } from './token-info.service';

@Controller('token-info')
export class TokenInfoController {
  constructor(private readonly tokenInfoService: TokenInfoService) {}

  @Get()
  getTokenInfo(
    @Query('token') token: string,
    @Headers('x-api-key') apiKey: string,
  ): any {
    return this.tokenInfoService.getTokenInfo(token, apiKey);
  }
}
