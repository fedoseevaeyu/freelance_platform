import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(
    @Query('type') type: 'service' | 'job',
    @Query('category') category: string,
    @Query('tags') tags: string,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const parsedTags = tags ? tags.split(',') : [];
    return this.postsService.getPosts(type, category, parsedTags, page);
  }
}
