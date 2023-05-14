import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaService } from './services/prisma/prisma.service';
import { AuthModule } from './resources/auth/auth.module';
import { ProfileModule } from './resources/profile/profile.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from './resources/upload/upload.module';
import { StaticModule } from './resources/static/static.module';
import { CategoriesModule } from './resources/categories/categories.module';
import { TagsModule } from './resources/tags/tags.module';
import { ServicesModule } from './resources/services/services.module';
import { AuthService } from './resources/auth/auth.service';
import { UserMiddleware } from './resources/auth/middleware/auth/auth.middleware';
import { JobPostModule } from './resources/job-post/job-post.module';
import {PostsModule} from "./resources/posts/posts.module";

@Module({
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AuthService,
  ],
  imports: [
    ThrottlerModule.forRoot({
      limit: 100,
      ttl: 60,
    }),
    AuthModule,
    ProfileModule,
    UploadModule,
    StaticModule,
    CategoriesModule,
    TagsModule,
    ServicesModule,
    JobPostModule,
      PostsModule
  ],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude(
        'auth/(.*)',
        {
          method: RequestMethod.GET,
          path: 'categories/(.*)',
        },
        {
          method: RequestMethod.GET,
          path: 'job-post/(.*)',
        },
        {
          method: RequestMethod.GET,
          path: 'job-post',
        },
        {
          method: RequestMethod.GET,
          path: 'profile/:username',
        },
          'posts/(.*)',
          'posts',
        'services/:slug',
        'services/user/:username',
        {
          path: 'services',
          method: RequestMethod.GET,
        },
        'static/(.*)',
        'upload/(.*)',
        'categories',
        'tags',
      )
      .forRoutes('*');
  }
}
