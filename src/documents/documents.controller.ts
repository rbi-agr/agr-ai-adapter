import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  async uploadFile() {
    const filePath = path.join(__dirname, '../../uploads/file.pdf');
    try {
      const fileContent = fs.readFileSync(filePath);
      if (!fileContent) {
        throw new BadRequestException('No file content found');
      }

      await this.documentsService.uploadDocument(fileContent);

      return { message: 'Document uploaded successfully!' };
    } catch (error) {
      throw new BadRequestException(`Error uploading document: ${error.message}`);
    }
  }
}

