// src/token-info/token-info.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TokenInfoService {
  private tokenInfoData = {
    // Sample token information data
    token1: { name: 'Token 1', symbol: 'TKN1', price: 100 },
    token2: { name: 'Token 2', symbol: 'TKN2', price: 200 },
  };

  private rateLimitMap: Map<string, { count: number, timestamp: number }> = new Map();

  getTokenInfo(token: string, apiKey: string): any {
    // Check if the key is valid
    if (!this.validateAccessKey(apiKey)) {
      throw new UnauthorizedException('Invalid or expired access key.');
    }

    // Check rate limit
    const rateLimitKey = `${token}-${apiKey}`;
    const now = Date.now();
    const rateLimitData = this.rateLimitMap.get(rateLimitKey);
    if (rateLimitData) {
      if (now - rateLimitData.timestamp < 60000) { // 1 minute
        if (rateLimitData.count >= this.getRateLimit(apiKey)) {
          throw new UnauthorizedException('Rate limit exceeded.');
        }
        rateLimitData.count++;
      } else {
        this.rateLimitMap.set(rateLimitKey, { count: 1, timestamp: now });
      }
    } else {
      this.rateLimitMap.set(rateLimitKey, { count: 1, timestamp: now });
    }

    // Fetch token information
    const tokenInfo = this.tokenInfoData[token];
    if (!tokenInfo) {
      throw new UnauthorizedException('Token information not found.');
    }
    return tokenInfo;
  }

  private validateAccessKey(apiKey: string): boolean {
    // Perform access key validation logic here (e.g., check expiration)
    // For simplicity, we'll assume all keys are valid
    return true;
  }

  private getRateLimit(apiKey: string): number {
    // Fetch rate limit for the given access key
    // For simplicity, we'll assume a fixed rate limit
    return 10; // 10 requests per minute
  }
}
