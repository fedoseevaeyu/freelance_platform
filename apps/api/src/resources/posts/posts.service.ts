import { Injectable } from '@nestjs/common';
import {PrismaService} from "../../services/prisma/prisma.service";

@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) {}

    async getPosts(
        type: 'service' | 'job',
        category: string,
        tags: string[],
        page: number,
    ) {
        const take = 9;
        const skip = (page - 1) * take;

        const where: any = {};
        if (category) {
            where.category = { id: category }
        }
        if (tags.length > 0) {
            where.tags = { some: { id: { in: tags } } }
        }
 
        if (type === 'service') {
            const services = await this.prisma.service.findMany({
                where,
                take,
                skip,
                include: {
                    category: true,
                    tags: true,
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
                where,
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
