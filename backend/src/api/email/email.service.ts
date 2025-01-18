import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private readonly _configService: ConfigService) {
    SendGrid.setApiKey(_configService.get('SENDGRID_KEY') ?? '');
  }

  async sendEmail(
    to: string,
    templateId: string,
    dynamicTemplateData: Record<string, unknown>,
  ): Promise<void> {
    SendGrid.send({
      to,
      from: {
        name: 'ManageEase',
        email: this._configService.get('SENDGRID_EMAIL') ?? '',
      },
      templateId,
      cc: [],
      bcc: [],
      dynamicTemplateData,
      hideWarnings: true,
    });
  }
}
