import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private readonly _configService: ConfigService) {
    super(
      { header: 'Api-Key', prefix: '' },
      true,
      (apiKey: string, done: any) => {
        const configApiKey = this._configService.get('API_KEYS');

        if (!configApiKey?.split(',').includes(apiKey)) {
          done(false);
        }

        done(true);
      },
    );
  }
}
