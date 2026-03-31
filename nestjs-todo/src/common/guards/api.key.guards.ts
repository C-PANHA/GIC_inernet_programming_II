import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface RequestWithHeaders extends Request {
  headers: Record<string, string | string[] | undefined>;
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithHeaders>();
    const headerValue = req.headers['x-api-key'];
    const apiKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const expectedApiKey = this.configService.get<string>('API_KEY');

    if (!apiKey || !expectedApiKey || apiKey !== expectedApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
