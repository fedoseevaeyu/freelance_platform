import { Module } from '@nestjs/common';
import { JobPostService } from './job-post.service';
import { JobPostController } from './job-post.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [JobPostController],
  providers: [JobPostService, PrismaService, AuthService],
})
export class JobPostModule {}
