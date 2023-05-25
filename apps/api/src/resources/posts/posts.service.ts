import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { OrderStatus} from "@prisma/client";

const days = (date_1) =>{
  let difference = date_1.getTime() - new Date().getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
}
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(
    type: 'service' | 'job',
    category: string,
    tags: string[],
    page: number,
    price: [number, number],
    until: Date,
  ) {
    const take = 9;
    const skip = (page - 1) * take;

    const where: any = {};
    if (category) {
      where.category = { id: category };
    }
    if (tags.length > 0) {
      where.tags = { some: { id: { in: tags } } };
    }

    if (type === 'service') {
      const services = await this.prisma.service.findMany({
        where: {
          ...where,
          package: {
            some: {
              price: {
                  lte: Number(price[1]),
                  gte: Number(price[0]),
              },
              deliveryDays: {
                lte: days(until),
              }
            }
          }
        },
        take,
        skip,
        include: {
          category: true,
          tags: true,
          package: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const count = await this.prisma.service.count({ where });
      const nextPage = skip + take >= count ? null : page + 1;

      return {
        posts: services,
        nextPage,
      };
    } else {
      const jobPosts = await this.prisma.jobPost.findMany({
        where: {
          ...where,
          orders: {
            every:
                {status: {in: [OrderStatus.Canceled, OrderStatus.Response]},}
          },
          budget: {
              lte: Number(price[1]),
              gte: Number(price[0]),
          },
          deadline: {
            lte: until,
          }
        },
        take,
        skip,
        include: {
          category: true,
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const count = await this.prisma.jobPost.count({ where });
      const nextPage = skip + take >= count ? null : page + 1;

      return {
        posts: jobPosts,
        nextPage,
      };
    }
  }
}
