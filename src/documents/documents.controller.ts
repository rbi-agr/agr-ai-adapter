import { DocumentsService } from './documents.service';
import * as fs from 'fs';
import * as path from 'path';
import {BadRequestException, Body, Controller, Post} from "@nestjs/common";
import {RagDataDto} from "./dto/rag-data-dto";

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

  @Post('fetch-rag-response')
  async fetchFile(@Body() ragDataDto: RagDataDto) {
    const ragDoc = await this.documentsService.getRagResponse(ragDataDto);
    const botResponse = await this.documentsService.getMistralResponse(ragDataDto, ragDoc);
    return {reply: botResponse}
  }
}

