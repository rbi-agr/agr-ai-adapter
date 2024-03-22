import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service.js';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({
    dest: 'uploads/',
  }),],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
