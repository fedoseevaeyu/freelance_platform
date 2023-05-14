import {HttpException, HttpStatus, Injectable, NestMiddleware,} from '@nestjs/common';
import {User} from '@prisma/client';
import {NextFunction, Request, Response} from 'express';
import {AuthService} from 'src/resources/auth/auth.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new HttpException(
          'Отсутствующий или просроченный токен',
          HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      req.body.user = await this.authService.verify(token);
      next();
    } catch {
      throw new HttpException(
        'Отсутствующий или просроченный токен',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
