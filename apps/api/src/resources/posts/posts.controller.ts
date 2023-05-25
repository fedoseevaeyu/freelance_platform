import {Controller, DefaultValuePipe, Get, ParseIntPipe, Query} from '@nestjs/common';
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
    @Query('price', new DefaultValuePipe([0, 10000])) price: [number, number],
    @Query('until') until: string,
  ) {
    const parsedTags = tags ? tags.split(',') : [];
    // const parsedPrice = price ? price.split(',') : [];
    return this.postsService.getPosts(type, category, parsedTags, page, price, new Date(until));
  }
}
