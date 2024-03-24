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
      const chunks = await this.documentsService.uploadDocument(fileContent);
      const response = await this.documentsService.createDocuments(chunks, 'file.pdf')
      return response;
    } catch (error) {
      throw new BadRequestException(`Error uploading document: ${error.message}`);
    }
  }

  @Post('fetch-rag-response')
  async fetchFile(@Body() ragDataDto: RagDataDto) {
    const ragDoc = await this.documentsService.getRagResponse(ragDataDto);
    let botResponse = "I dont think i can help you with this query!";
    let isRagDone = false;
    if (ragDoc.length > 100) {
      botResponse = await this.documentsService.getMistralResponse(ragDataDto, ragDoc);
      isRagDone = true
    }
    return {response: botResponse, isRagDone: isRagDone}
  }
}

