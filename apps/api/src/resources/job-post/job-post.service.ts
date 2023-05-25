import { HttpException, Injectable } from '@nestjs/common';
import { stringToSlug } from 'src/helpers/slug';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { CreateJobPostDTO } from './dto/create.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class JobPostService {
  constructor(
    protected p: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async createJobPost(data: CreateJobPostDTO, userId: string) {
    const { category, deadline, description, images, price, tags, title } =
      data;

    const c = await this.p.category.findFirst({
      where: {
        id: category,
      },
    });
    if (!c)
      throw new HttpException(
        'Категория с указанным идентификатором не найдена.',
        404,
      );
    return await this.p.jobPost
      .create({
        data: {
          description,
          slug: stringToSlug(title, 10),
          title,
          user: {
            connect: { id: userId },
          },
          category: {
            connect: {
              id: category,
            },
          },
          tags: {
            connect: tags.map((tag) => ({ id: tag })),
          },
          images,
          deadline,
          budget: price,
        },
        select: {
          slug: true,
          category: true,
        },
      })
      .then((e) => {
        try {
          this.httpService.axiosRef.post(
            `http://0.0.0.0:5001/recommendations/clear-cache`,
          );
        } catch (e) {
          console.log(e);
        }

        return e;
      });
  }
  async getJobPost(slug: string) {
    const post = await this.p.jobPost.findFirst({
      where: {
        slug,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            verified: true,
            avatarUrl: true,
            username: true,
            profileCompleted: true,
          },
        },
        budget: true,
        category: {
          select: {
            name: true,
            slug: true,
            id: true,
          },
        },
        orders: true,
        deadline: true,
        description: true,
        images: true,
        slug: true,
        title: true,
        tags: {
          select: {
            name: true,
            id: true,
            slug: true,
          },
        },
        createdAt: true,
        id: true,
        claimed: true,
        claimedBy: {
          select: {
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (!post)
      throw new HttpException('Поста с предоставленным slug не найдено.', 404);

    let recommendServices = [];
    try {
      const recommendIds = await this.httpService.axiosRef
        .get(`http://0.0.0.0:5001/recommendations/job_post/${post.id}`)
        .then((e) => e.data);
      recommendServices = await this.p.service.findMany({
        where: {
          id: {
            in: recommendIds,
          },
        },
        include: {
          category: true,
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (err) {
      console.log(err);
    }

    return {
      ...post,
      recommendServices,
    };
  }
  async getJobPostsByUsername(username: string, take?: string) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const posts = await this.p.jobPost.findMany({
      where: {
        user: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      },
      select: {
        user: {
          select: {
            name: true,
            verified: true,
            avatarUrl: true,
            username: true,
          },
        },
        budget: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        deadline: true,
        description: true,
        images: true,
        slug: true,
        title: true,
        tags: {
          select: {
            name: true,
            id: true,
            slug: true,
          },
        },
        createdAt: true,
        id: true,
        orders: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    if (!posts)
      throw new HttpException('Посты для этого пользователя не найдены.', 404);
    if (posts.length === 10) {
      return {
        posts,
        next: toTake + 10,
      };
    }
    return { posts };
  }
  async getAllJobPosts(take?: string) {
    const toTake = Number.isNaN(Number(take)) ? 10 : Number(take);
    const posts = await this.p.jobPost.findMany({
      select: {
        user: {
          select: {
            name: true,
            verified: true,
            avatarUrl: true,
            username: true,
          },
        },
        budget: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        deadline: true,
        description: true,
        images: true,
        slug: true,
        title: true,
        tags: {
          select: {
            name: true,
            id: true,
            slug: true,
          },
        },
        createdAt: true,
        id: true,
      },
      take: toTake,
      skip: toTake > 10 ? toTake - 10 : undefined,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    if (posts.length === 10) {
      return {
        posts,
        next: toTake + 10,
      };
    }
    return { posts };
  }
}
