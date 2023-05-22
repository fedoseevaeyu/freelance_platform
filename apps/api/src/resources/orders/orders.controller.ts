import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BodyWithUser } from 'src/types/body';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(
    protected p: PrismaService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('responses')
  async responses(@Body() body: BodyWithUser<CreateOrderDto>) {
    if (body.user.role === 'Freelancer') {
      return this.p.order.findMany({
        where: {
          freelancerId: body.user.id,
        },
        include: {
          jobPost: true,
        },
      });
    } else {
      return this.p.order.findMany({
        where: {
          clientId: body.user.id,
        },
        include: {
          service: true,
        },
      });
    }
  }

  @Post()
  async createOrder(@Body() body: BodyWithUser<CreateOrderDto>) {
    return this.ordersService.createOrder(body, body.user.id);
  }

  @Post(':id/accept')
  async acceptOrder(
    @Param('id') id: string,
    @Body() body: BodyWithUser<CreateOrderDto>,
  ) {
    await this.p.order.update({
      where: {
        id,
      },
      data: {
        status: OrderStatus.Accepted,
      },
    });
  }

  @Post(':id/done')
  async doneOrder(
    @Param('id') id: string,
    @Body() body: BodyWithUser<CreateOrderDto>,
  ) {
    await this.p.order.update({
      where: {
        id,
      },
      data: {
        status: OrderStatus.Done,
      },
    });
  }

  @Post(':id/reject')
  async rejectOrder(
    @Param('id') id: string,
    @Body() body: BodyWithUser<CreateOrderDto>,
  ) {
    await this.p.order.update({
      where: {
        id,
      },
      data: {
        status: OrderStatus.Canceled,
      },
    });
  }
}
