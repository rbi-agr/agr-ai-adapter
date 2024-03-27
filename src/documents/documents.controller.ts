import { DocumentsService } from './documents.service';
import * as fs from 'fs';
import * as path from 'path';
import {BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors} from "@nestjs/common";
import {RagDataDto} from "./dto/rag-data-dto";
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    // Check file format
    const allowedFormats = ['pdf', 'txt', 'doc', 'docx'];
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    if (!allowedFormats.includes(fileExt)) {
      throw new BadRequestException('Unsupported file format');
    }
    //Create the upload folder if it doesnot exist
    const uploadFolder = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }

    // Save file to uploads folder
    const filePathtoupload = path.join(uploadFolder, file.originalname);
    const fileContent = fs.readFileSync(file.path)
    fs.writeFileSync(filePathtoupload,fileContent);
    fs.unlinkSync(file.path)
    

    const filePath = path.join(__dirname, `../../uploads/${file.originalname}`);
    
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

