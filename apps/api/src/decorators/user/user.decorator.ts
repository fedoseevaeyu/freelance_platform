import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User as U } from '@prisma/client';
import { JwtPayload, verify } from 'jsonwebtoken';
import { SIGN_SECRET } from 'src/constants';
import { PrismaService } from 'src/services/prisma/prisma.service';

export interface DecodedJWT extends JwtPayload {
  id: string;
  userType: 'Client' | 'Freelancer';
}

export const User = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<Partial<U>> => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization']?.replace('Bearer ', '');
    if (!token)
      throw new HttpException(
        'Для доступа к этому ресурсу требуется токен аутентификации.',
        HttpStatus.UNAUTHORIZED,
      );
    let jwt: DecodedJWT = undefined;
    let user: U;
    try {
      jwt = verify(token, SIGN_SECRET) as DecodedJWT;
      user = await new PrismaService().user.findFirstOrThrow({
        where: { id: jwt.id },
      });
    } catch (err) {
      throw new HttpException(
        'Недопустимый токен аутентификации.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  },
);
