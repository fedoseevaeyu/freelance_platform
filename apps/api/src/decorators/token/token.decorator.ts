import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { SIGN_SECRET } from 'src/constants';

export interface DecodedJWT extends JwtPayload {
  id: string;
  userType: 'client' | 'freelancer';
}

export const Token = createParamDecorator(
  (
    data: { optional?: boolean; serialize?: boolean },
    ctx: ExecutionContext,
  ): string | DecodedJWT => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.replace('Bearer ', '');
    if (!token && !data?.optional)
      throw new HttpException(
        'Для доступа к этому ресурсу требуется токен аутентификации.',
        HttpStatus.UNAUTHORIZED,
      );
    let jwt: DecodedJWT = undefined;
    if (data?.serialize) {
      try {
        jwt = verify(token, SIGN_SECRET) as unknown as DecodedJWT;
        return jwt;
      } catch (err) {
        throw new HttpException(
          'Недействительный или просроченный токен аутентификации',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    return data?.serialize ? jwt : token;
  },
);
