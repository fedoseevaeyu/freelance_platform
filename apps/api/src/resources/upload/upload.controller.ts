import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { Token } from 'src/decorators/token/token.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_, file, cb) =>
          cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`),
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadFile(
    @Token({ serialize: true }) { id },
    @UploadedFile() file: Express.Multer.File,
    @Query('to') to?: string,
  ) {
    return await this.uploadService.uploadFile(file, id, to);
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (_, file, cb) =>
          cb(null, `${Date.now()}-${randomUUID()}-${file.originalname}`),
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async uploadMultipleFiles(
    @Token({ serialize: true }) { id },
    @UploadedFiles() files: Express.Multer.File[],
    @Query('to') to?: string,
  ) {
    return await this.uploadService.uploadMultipleFiles(files, id, to);
  }
}
