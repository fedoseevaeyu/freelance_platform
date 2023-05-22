import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, AuthService],
})
export class OrdersModule {}
