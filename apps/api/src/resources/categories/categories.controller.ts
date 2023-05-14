import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async fetchAll() {
    return await this.categoriesService.fetchAll();
  }

  @Post('create')
  async create(@Body('name') name: string) {
    if (!name) throw new HttpException('Название категории обязательно.', 400);
    return await this.categoriesService.create(name);
  }
  @Get(':slug')
  async fetchUsingSlug(@Param('slug') slug: string) {
    return await this.categoriesService.getCategoryStats(slug);
  }
  @Get(':slug/jobs')
  async fetchJobsByCategory(@Param('slug') slug: string, @Query('take') take) {
    return await this.categoriesService.fetchUsingId(slug, 'Job', take);
  }
  @Get(':slug/services')
  async fetchServicesByCategory(
    @Param('slug') slug: string,
    @Query('take') take,
  ) {
    return await this.categoriesService.fetchUsingId(slug, 'Service', take);
  }
}
