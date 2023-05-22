import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(protected p: PrismaService) {}

  async createOrder(data: CreateOrderDto, id: string) {
    const { job_post_id, service_id, client_id, freelancer_id } = data;

    return await this.p.order.create({
      data: {
        status: OrderStatus.Response,
        client_agree: client_id === id,
        freelancer_agree: freelancer_id === id,
        service: {
          connect: {
            id: service_id,
          },
        },
        jobPost: {
          connect: {
            id: job_post_id,
          },
        },
        freelancer: {
          connect: {
            id: freelancer_id,
          },
        },
        client: {
          connect: {
            id: client_id,
          },
        },
      },
    });
  }
}
